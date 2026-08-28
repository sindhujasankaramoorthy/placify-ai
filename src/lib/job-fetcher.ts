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
  url?: string;
  desc?: string;
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
    const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=100");
    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }
    const data = await res.json();
    const allJobs = data.jobs || [];
    
    // Filter out senior roles and keep beginner/mid/intern roles
    const filteredJobs = allJobs.filter((job: any) => {
      const title = (job.title || "").toLowerCase();
      const seniorKeywords = [
        "senior", "sr.", "sr ", "lead", "principal", "staff", "manager", "director", 
        "architect", "vp", "vice president", "head", "cto", "tech lead", "expert", "management", "mgr"
      ];
      return !seniorKeywords.some(keyword => title.includes(keyword));
    });
    
    // 3. Format and Filter jobs (take up to 10 latest)
    const formattedJobs: JobInfo[] = filteredJobs.slice(0, 10).map((job: any) => {
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
        url: job.url || "https://google.com/careers",
        desc: job.description || `<p>No description provided. Please apply directly through the portal.</p>`
      };
    });

    // We can merge with some static known top-tier companies as 'internships' to keep the aesthetic
    const featured: JobInfo[] = [
      { 
        c: "Google", 
        role: "SDE Intern", 
        loc: "Bengaluru", 
        salary: "1.2L / mo", 
        match: 96, 
        skills: ["React", "TypeScript", "DSA"],
        url: "https://careers.google.com",
        desc: "<h3>Role Description</h3><p>We are seeking a Software Development Engineer Intern to join Google's team in Bengaluru. You will work on real projects in React and TypeScript web app creation, algorithmic systems, and data structures. Highly collaborative environment with industry mentors.</p><h4>Requirements</h4><ul><li>Currently enrolled in a Bachelor's, Master's or PhD degree in Computer Science or related fields</li><li>Experience coding in TypeScript/JavaScript, C++, Java, or Go</li><li>Strong problem-solving and algorithmic foundations</li></ul>"
      },
      { 
        c: "Microsoft", 
        role: "SWE Intern", 
        loc: "Hyderabad", 
        salary: "1.1L / mo", 
        match: 91, 
        skills: ["C#", "Azure", "System Design"],
        url: "https://careers.microsoft.com",
        desc: "<h3>About the Role</h3><p>As a Software Engineering Intern at Microsoft Hyderabad, you will be part of a team pushing the boundaries of cloud systems and platform services on Azure. You'll contribute to codebases, participate in design reviews, and build tools that empower millions of users.</p><h4>Requirements</h4><ul><li>Demonstrated capability in C#, C++, or TypeScript</li><li>Basic understanding of database interfaces and cloud architectures</li><li>Outstanding Communication & teamwork skills</li></ul>"
      }
    ];
    
    const finalJobs = [...featured, ...formattedJobs].slice(0, 9); // Keeping UI clean with 9 cards

    // 4. Save to Cache
    await fs.writeFile(CACHE_FILE, JSON.stringify(finalJobs, null, 2));

    return finalJobs;
  } catch (err) {
    console.error("Error fetching jobs:", err);
    // Fallback static data if network fails
    return [
      { 
        c: "Google", 
        role: "SDE Intern", 
        loc: "Bengaluru", 
        salary: "1.2L / mo", 
        match: 96, 
        skills: ["React", "TypeScript", "DSA"],
        url: "https://careers.google.com",
        desc: "<h3>Role Description</h3><p>We are seeking a Software Development Engineer Intern to join Google's team in Bengaluru. You will work on real projects in React and TypeScript web app creation, algorithmic systems, and data structures. Highly collaborative environment with industry mentors.</p><h4>Requirements</h4><ul><li>Currently enrolled in a Bachelor's, Master's or PhD degree in Computer Science or related fields</li><li>Experience coding in TypeScript/JavaScript, C++, Java, or Go</li><li>Strong problem-solving and algorithmic foundations</li></ul>"
      },
      { 
        c: "Stripe", 
        role: "Frontend Engineer", 
        loc: "Remote", 
        salary: "$60k", 
        match: 88, 
        skills: ["React", "GraphQL", "UI"],
        url: "https://stripe.com/careers",
        desc: "<h3>Frontend Engineer</h3><p>Join the Stripe Dashboard team remotely and work on building beautiful payment interfaces, analytics tools, and dashboard components. Work with React, GraphQL, and modern CSS tokens.</p>"
      },
      { 
        c: "Razorpay", 
        role: "Backend", 
        loc: "Bengaluru", 
        salary: "18 LPA", 
        match: 84, 
        skills: ["Node", "SQL", "AWS"],
        url: "https://razorpay.com/jobs",
        desc: "<h3>Backend Engineer</h3><p>Work on core payment gateways at Razorpay. Designing robust APIs, handling thousands of request loads per second, optimizing database queries, and utilizing AWS infrastructures.</p>"
      }
    ];
  }
});
