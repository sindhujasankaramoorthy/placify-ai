import { performRuleBasedATSAnalysis } from "./ruleEngine.ts";
import type { ATSScanResult } from "./ruleEngine.ts";

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  // Strip markdown ```json ... ``` or ``` ... ```
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  // Remove any leading/trailing non-bracket text if model included preface
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

export async function analyzeWithClaudeLLM(
  resumeText: string,
  jobDescription: string,
  ruleResult: ATSScanResult
): Promise<ATSScanResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_anthropic_api_key_here") {
    console.log("[ATS SCAN] No valid ANTHROPIC_API_KEY provided; utilizing accurate rule-based ATS engine.");
    return ruleResult;
  }

  const prompt = `You are a Senior ATS Evaluation Engine and Executive Technical Recruiter.
Evaluate the candidate's resume against the target Job Description.

Analyze keyword alignment, missing technical competencies, formatting readability, and section structure.

Candidate Resume Text:
"""
${resumeText}
"""

Target Job Description:
"""
${jobDescription}
"""

Base Ground-Truth Rule Checks:
- Matched Tech: ${ruleResult.techStack.matched.join(", ") || "None"}
- Missing Tech: ${ruleResult.techStack.missing.join(", ") || "None"}
- Sections Found: ${ruleResult.sectionsFound.join(", ") || "None"}
- Sections Missing: ${ruleResult.sectionsMissing.join(", ") || "None"}

INSTRUCTIONS:
1. Provide unbiased scores from 0 to 100 for overallScore, matchScore, formattingScore, and structureScore.
2. Identify matched vs missing technical skills and keywords.
3. List 2-4 concrete strengths, 2-4 weaknesses, and 3-5 high-impact actionable suggestions.
4. Set verdict to exactly one of: "Strong match", "Moderate match", or "Weak match".
5. OUTPUT STRICT JSON ONLY. Do NOT wrap with markdown, explanation, or notes.

JSON Schema:
{
  "overallScore": 82,
  "matchScore": 85,
  "formattingScore": 80,
  "structureScore": 80,
  "techStack": {
    "matched": ["Python", "React"],
    "missing": ["Docker", "Kubernetes"]
  },
  "keywords": {
    "matched": ["REST APIs", "Agile"],
    "missing": ["CI/CD"]
  },
  "sectionsFound": ["Contact Information", "Technical Skills", "Education", "Projects"],
  "sectionsMissing": ["Experience / Internships"],
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "suggestions": ["...", "..."],
  "verdict": "Strong match"
}`;

  async function callClaudeApi(): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000); // 16s timeout

    try {
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        "x-api-key": apiKey as string,
        "anthropic-version": "2023-06-01",
      };
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          temperature: 0.1,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        const errorText = await resp.text().catch(() => "");
        throw new Error(`Claude API error HTTP ${resp.status}: ${errorText}`);
      }

      const data = await resp.json();
      const content = data.content?.[0]?.text || "";
      return content;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // First attempt
  try {
    const rawOutput = await callClaudeApi();
    const cleaned = cleanJsonString(rawOutput);
    const parsed = JSON.parse(cleaned);
    return mergeResults(parsed, ruleResult);
  } catch (errFirst) {
    console.warn("[ATS LLM] First Claude attempt failed, retrying once:", errFirst);
    // Retry once
    try {
      const rawRetry = await callClaudeApi();
      const cleanedRetry = cleanJsonString(rawRetry);
      const parsedRetry = JSON.parse(cleanedRetry);
      return mergeResults(parsedRetry, ruleResult);
    } catch (errRetry) {
      console.warn("[ATS LLM] Retry failed or timed out; falling back to rule-based analysis:", errRetry);
      return ruleResult;
    }
  }
}

function mergeResults(llmResult: any, ruleResult: ATSScanResult): ATSScanResult {
  const sanitizeScore = (score: any, fallback: number) => {
    const num = Number(score);
    return isNaN(num) ? fallback : Math.max(0, Math.min(100, Math.round(num)));
  };

  const overallScore = sanitizeScore(llmResult.overallScore, ruleResult.overallScore);
  const matchScore = sanitizeScore(llmResult.matchScore, ruleResult.matchScore);
  const formattingScore = sanitizeScore(llmResult.formattingScore, ruleResult.formattingScore);
  const structureScore = sanitizeScore(llmResult.structureScore, ruleResult.structureScore);

  let verdict: "Strong match" | "Moderate match" | "Weak match" = "Moderate match";
  if (llmResult.verdict === "Strong match" || llmResult.verdict === "Strong") {
    verdict = overallScore >= 80 ? "Strong match" : overallScore >= 60 ? "Moderate match" : "Weak match";
  } else if (llmResult.verdict === "Weak match" || llmResult.verdict === "Weak") {
    verdict = "Weak match";
  } else if (overallScore >= 80) {
    verdict = "Strong match";
  } else if (overallScore < 60) {
    verdict = "Weak match";
  }

  // Merge tech skills union with rule ground-truth
  const matchedTechSet = new Set<string>([
    ...(Array.isArray(llmResult.techStack?.matched) ? llmResult.techStack.matched : []),
    ...ruleResult.techStack.matched,
  ]);

  const missingTechSet = new Set<string>([
    ...(Array.isArray(llmResult.techStack?.missing) ? llmResult.techStack.missing : []),
    ...ruleResult.techStack.missing,
  ]);
  // Remove matched from missing
  matchedTechSet.forEach((m) => missingTechSet.delete(m));

  const matchedKeywordsSet = new Set<string>([
    ...(Array.isArray(llmResult.keywords?.matched) ? llmResult.keywords.matched : []),
    ...ruleResult.keywords.matched,
  ]);

  const missingKeywordsSet = new Set<string>([
    ...(Array.isArray(llmResult.keywords?.missing) ? llmResult.keywords.missing : []),
    ...ruleResult.keywords.missing,
  ]);
  matchedKeywordsSet.forEach((k) => missingKeywordsSet.delete(k));

  return {
    overallScore,
    matchScore,
    formattingScore,
    structureScore,
    techStack: {
      matched: Array.from(matchedTechSet),
      missing: Array.from(missingTechSet),
    },
    keywords: {
      matched: Array.from(matchedKeywordsSet),
      missing: Array.from(missingKeywordsSet),
    },
    sectionsFound: Array.isArray(llmResult.sectionsFound) && llmResult.sectionsFound.length > 0
      ? llmResult.sectionsFound
      : ruleResult.sectionsFound,
    sectionsMissing: Array.isArray(llmResult.sectionsMissing)
      ? llmResult.sectionsMissing
      : ruleResult.sectionsMissing,
    strengths: Array.isArray(llmResult.strengths) && llmResult.strengths.length > 0
      ? llmResult.strengths
      : ruleResult.strengths,
    weaknesses: Array.isArray(llmResult.weaknesses) && llmResult.weaknesses.length > 0
      ? llmResult.weaknesses
      : ruleResult.weaknesses,
    suggestions: Array.isArray(llmResult.suggestions) && llmResult.suggestions.length > 0
      ? llmResult.suggestions
      : ruleResult.suggestions,
    verdict,
  };
}
