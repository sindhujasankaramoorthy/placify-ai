import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";

interface JobInfo {
  c: string; // company
  role: string;
  loc: string;
  salary: string;
  match: number;
  skills: string[];
}

const CACHE_FILE = path.join(process.cwd(), "jobs-cache.json");
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const getDailyJobs = createServerFn({ method: "GET" }).handler(async (): Promise<JobInfo[]> => {
  try {
    // 1. Check Cache
    try {
      const cacheStat = await fs.stat(CACHE_FILE);
      const isExpired = Date.now() - cacheStat.mtimeMs > CACHE_TTL;
      
      if (!isExpired) {
        const cacheData = await fs.readFile(CACHE_FILE, "utf-8");
        return JSON.parse(cacheData) as JobInfo[];
      }
    } catch (e) {
      // Cache doesn't exist, proceed to fetch
    }

    // 2. Fetch from free public API (Remotive) 
    // Software Development category
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=40");
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data = await res.json();
    const allJobs = data.jobs || [];
    
    // 3. Format and Filter jobs (take up to 10 latest)
    const formattedJobs: JobInfo[] = allJobs.slice(0, 10).map((job: any) => {
      // Create a random, but stable mock 'match' score between 75 and 99
      const matchScore = 75 + (job.id % 25);
      
      // Extract skills from tags or fallback
      const skills = job.tags?.slice(0, 3) || ["Software Dev"];

      return {
        c: job.company_name || "Unknown Company",
        role: job.title || "Software Engineer",
        loc: job.candidate_required_location || "Remote",
        salary: job.salary || "Competitive", // The API often returns empty string for salary
        match: matchScore,
        skills,
      };
    });

    // We can merge with some static known top-tier companies as 'internships' to keep the aesthetic
    const featured: JobInfo[] = [
      { c: "Google", role: "SDE Intern", loc: "Bengaluru", salary: "1.2L / mo", match: 96, skills: ["React", "TypeScript", "DSA"] },
      { c: "Microsoft", role: "SWE Intern", loc: "Hyderabad", salary: "1.1L / mo", match: 91, skills: ["C#", "Azure", "System Design"] }
    ];
    
    const finalJobs = [...featured, ...formattedJobs].slice(0, 9); // Keeping UI clean with 9 cards

    // 4. Save to Cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(finalJobs, null, 2));

    return finalJobs;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    // Fallback static data if network fails
    return [
      { c: "Google", role: "SDE Intern", loc: "Bengaluru", salary: "1.2L / mo", match: 96, skills: ["React", "TypeScript", "DSA"] },
      { c: "Stripe", role: "Frontend Engineer", loc: "Remote", salary: "$60k", match: 88, skills: ["React", "GraphQL", "UI"] },
      { c: "Razorpay", role: "Backend", loc: "Bengaluru", salary: "18 LPA", match: 84, skills: ["Node", "SQL", "AWS"] }
    ];
  }
});
