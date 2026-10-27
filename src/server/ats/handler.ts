import { ATS_PRESETS } from "./presets.ts";
import { performRuleBasedATSAnalysis } from "./ruleEngine.ts";
import type { ATSScanResult } from "./ruleEngine.ts";
import { analyzeWithClaudeLLM } from "./llmService.ts";
import { checkRateLimit } from "./rateLimiter.ts";
import { saveScanToDb, getScanHistoryFromDb, getLatestResumeFromDb } from "./db.ts";
import { formatResumeDataToText, extractTextFromPdfBuffer, extractTextFromDocxBuffer } from "./textExtractor.ts";

export async function handleAtsApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Only handle /api/ats routes
  if (!pathname.startsWith("/api/ats")) {
    return null;
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 1. GET /api/ats/presets
  if (request.method === "GET" && pathname === "/api/ats/presets") {
    return new Response(JSON.stringify({ presets: ATS_PRESETS }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Extract authenticated user ID
  const authHeader = request.headers.get("Authorization") || "";
  let userId = 1;
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    // In our system, if token has numeric id or format user_X, extract it
    const match = token.match(/user_?(\d+)/i);
    if (match) {
      userId = parseInt(match[1], 10);
    }
  }

  // 2. GET /api/ats/history
  if (request.method === "GET" && pathname === "/api/ats/history") {
    try {
      const history = getScanHistoryFromDb(userId, 10);
      return new Response(JSON.stringify({ history }), {
        status: 200,
        headers: corsHeaders,
      });
    } catch (err: any) {
      console.error("[ATS API] History error:", err);
      return new Response(
        JSON.stringify({ error: "DATABASE_ERROR", message: "Failed to retrieve scan history." }),
        { status: 500, headers: corsHeaders }
      );
    }
  }

  // 3. POST /api/ats/scan
  if (request.method === "POST" && pathname === "/api/ats/scan") {
    // A. Rate limit check (10 scans / hour per user)
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: "RATE_LIMIT_EXCEEDED",
          message: `You have reached the limit of ${rateCheck.limit} ATS scans per hour. Please try again in ${rateCheck.resetSeconds} seconds.`,
          resetSeconds: rateCheck.resetSeconds,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Retry-After": String(rateCheck.resetSeconds),
          },
        }
      );
    }

    // B. Parse & validate body
    let body: any = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.formData();
        const jd = (formData.get("jobDescription") as string) || "";
        const file = formData.get("file") as File | null;
        let fileText = "";
        if (file) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const name = (file.name || "").toLowerCase();
          if (name.endsWith(".pdf")) {
            fileText = await extractTextFromPdfBuffer(buffer);
          } else if (name.endsWith(".docx") || name.endsWith(".doc")) {
            fileText = await extractTextFromDocxBuffer(buffer);
          } else {
            fileText = buffer.toString("utf-8");
          }
        }
        body = {
          jobDescription: jd,
          resumeText: fileText || (formData.get("resumeText") as string) || "",
        };
      } catch (err) {
        return new Response(
          JSON.stringify({ error: "INVALID_FORM_DATA", message: "Failed to parse uploaded form data." }),
          { status: 400, headers: corsHeaders }
        );
      }
    } else {
      try {
        body = await request.json();
      } catch {
        return new Response(
          JSON.stringify({ error: "INVALID_JSON", message: "Invalid JSON request body." }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";

    // Validation: required, min 50 chars, max ~8000 chars
    if (!jobDescription) {
      return new Response(
        JSON.stringify({
          error: "VALIDATION_ERROR",
          message: "Job description is required.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (jobDescription.length < 50) {
      return new Response(
        JSON.stringify({
          error: "VALIDATION_ERROR",
          message: `Job description is too short (${jobDescription.length} characters). Please provide at least 50 characters of job details.`,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (jobDescription.length > 8500) {
      return new Response(
        JSON.stringify({
          error: "VALIDATION_ERROR",
          message: `Job description exceeds maximum limit (8,000 characters). Current length: ${jobDescription.length} characters.`,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // C. Resolve Resume Source
    let resumeText = "";

    if (typeof body.resumeText === "string" && body.resumeText.trim().length >= 20) {
      resumeText = body.resumeText.trim();
    } else if (body.resumeData && typeof body.resumeData === "object") {
      resumeText = formatResumeDataToText(body.resumeData);
    } else if (body.profile && typeof body.profile === "object") {
      resumeText = formatResumeDataToText(body.profile);
    }

    // Fallback: check database for user's latest saved resume
    if (!resumeText || resumeText.length < 20) {
      const dbResume = getLatestResumeFromDb(userId);
      if (dbResume && dbResume.content) {
        resumeText = formatResumeDataToText(dbResume.content);
      }
    }

    // If still no resume exists, return error instructing user to upload resume first
    if (!resumeText || resumeText.length < 20) {
      return new Response(
        JSON.stringify({
          error: "NO_RESUME_FOUND",
          message: "No active resume found for your account. Please upload or create your resume first on the Resume page.",
          link: "/dashboard/resume",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // D. Step b: Rule-based analysis
    const ruleResult = performRuleBasedATSAnalysis(resumeText, jobDescription);

    // E. Step c: LLM analysis (with fallback & retry)
    let finalResult: ATSScanResult;
    try {
      finalResult = await analyzeWithClaudeLLM(resumeText, jobDescription, ruleResult);
    } catch (llmErr) {
      console.warn("[ATS SCAN] LLM analysis encountered error, using rule-based fallback:", llmErr);
      finalResult = ruleResult;
    }

    // F. Step 4: Persistence to SQLite DB
    let scanId = 0;
    try {
      scanId = saveScanToDb(userId, jobDescription, finalResult);
    } catch (dbErr) {
      console.warn("[ATS SCAN] Failed to persist scan to DB:", dbErr);
    }

    // G. Return final merged result
    return new Response(
      JSON.stringify({
        id: scanId,
        userId,
        ...finalResult,
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  return new Response(
    JSON.stringify({ error: "NOT_FOUND", message: `Endpoint ${pathname} not found.` }),
    { status: 404, headers: corsHeaders }
  );
}
