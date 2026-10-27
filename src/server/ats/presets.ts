export interface ATSJobPreset {
  id: string;
  company: string;
  role: string;
  chipLabel: string;
  badge: string;
  description: string;
}

export const ATS_PRESETS: ATSJobPreset[] = [
  {
    id: "accenture-ai-intern",
    company: "Accenture India",
    role: "AI & Full-Stack Developer Intern",
    chipLabel: "Accenture India - AI & Full-Stack Developer Intern",
    badge: "AI / GenAI",
    description: `Accenture India is hiring an AI & Full-Stack Developer Intern.

About the Role:
Join our Advanced Technology Centers in India (ATCI) to design, build, and deploy next-generation enterprise applications incorporating AI agents, Retrieval-Augmented Generation (RAG), and modern full-stack architectures.

Key Responsibilities:
- Design and implement end-to-end web applications with interactive frontends and scalable microservices.
- Build intelligent generative AI components, utilizing vector databases (FAISS, Chroma, Pinecone) and embedding pipelines.
- Integrate RESTful APIs, manage database queries, and optimize query latency in SQL / MongoDB.
- Write clean, maintainable, and well-tested code following agile best practices.
- Collaborate with senior architects and cross-functional engineering teams during sprint cycles.

Required Skills & Qualifications:
- Currently pursuing B.E. / B.Tech / M.Tech in Computer Science, Information Technology, or related discipline (2025 / 2026 / 2027 batch).
- Solid programming proficiency in Python, Java, or TypeScript.
- Hands-on experience with modern frontend frameworks like React or Next.js and styling with TailwindCSS.
- Practical understanding of Retrieval-Augmented Generation (RAG), LLMs, and prompt engineering.
- Familiarity with SQL (PostgreSQL / MySQL) and NoSQL (MongoDB) databases.
- Version control using Git / GitHub and understanding of CI/CD pipelines.
- Strong analytical reasoning and problem-solving skills.`
  },
  {
    id: "tcs-sde-fresher",
    company: "Tata Consultancy Services (TCS)",
    role: "Software Engineer Fresher",
    chipLabel: "TCS - Software Engineer Fresher",
    badge: "Enterprise SDE",
    description: `Tata Consultancy Services (TCS) is hiring Associate Software Engineers (Freshers).

Job Overview:
As a Software Engineer at TCS, you will work on enterprise-scale distributed systems, banking and cloud applications, and data-driven solutions for Fortune 500 global clients.

Key Responsibilities:
- Participate in the complete Software Development Life Cycle (SDLC) from requirements analysis to deployment.
- Develop robust, scalable back-end services using Java, Python, or C++.
- Build responsive user interfaces utilizing HTML5, CSS3, and JavaScript / TypeScript.
- Write optimized SQL queries, stored procedures, and schema migrations for relational databases (MySQL, Oracle, PostgreSQL).
- Implement and document secure RESTful web services and API endpoints.
- Perform unit testing, integration testing, and participate in code reviews.
- Identify performance bottlenecks and implement bug fixes.

Required Skills & Qualifications:
- Bachelor's degree (B.E. / B.Tech / B.Sc / BCA / MCA) in Computer Science, Engineering, or relevant technical field.
- Strong foundational knowledge of Object-Oriented Programming (OOP) concepts, Data Structures, and Algorithms.
- Working knowledge of Java or Python, plus web fundamentals (HTML, CSS, JavaScript).
- Hands-on database experience with MySQL, PostgreSQL, or SQLite.
- Basic familiarity with Git, Linux environments, and REST APIs.
- Excellent verbal and written communication skills and eagerness to learn new technologies.`
  },
  {
    id: "innovate-devops-associate",
    company: "Innovate Solutions",
    role: "Cloud & DevOps Associate",
    chipLabel: "Innovate Solutions - Cloud & DevOps Associate",
    badge: "Cloud / DevOps",
    description: `Innovate Solutions is looking for a Cloud & DevOps Associate.

Job Overview:
We are seeking an enthusiastic DevOps and Cloud Infrastructure Associate to support our containerized production environments, automate deployment pipelines, and maintain high availability across our cloud services.

Key Responsibilities:
- Containerize application microservices using Docker and orchestrate clusters with Kubernetes.
- Deploy, configure, and monitor scalable cloud resources on Amazon Web Services (AWS) including EC2, S3, RDS, and VPC.
- Build and maintain automated Continuous Integration and Continuous Deployment (CI/CD) pipelines using GitHub Actions.
- Write automation and maintenance scripts in Python and Bash.
- Set up system telemetry, health alerts, and logging using Prometheus, Grafana, and AWS CloudWatch.
- Implement security best practices, access management (IAM), and network firewall configurations.

Required Skills & Qualifications:
- Degree in Computer Science, Information Technology, or equivalent practical cloud experience.
- Demonstrable hands-on experience with Docker containerization and Kubernetes orchestration.
- Knowledge of AWS core services (EC2, S3, IAM, CloudWatch, Lambda).
- Proficiency with Linux command line, shell scripting (Bash), and Python scripting.
- Understanding of CI/CD concepts, automated testing, and Git version control workflows.
- Familiarity with Infrastructure as Code (IaC) principles using Terraform is a strong plus.`
  }
];
