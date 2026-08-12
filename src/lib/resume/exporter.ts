import { CandidateProfile } from "./types";

/**
 * Triggers standard high-resolution print/PDF download for the resume element
 */
export function exportToPdf(elementId: string, filename: string = "Tailored_Resume.pdf"): void {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Resume preview element not found for PDF export.");
    return;
  }

  // Open formatted print preview window
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download/print the PDF resume.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #111827;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.5;
          }
          h1 { font-size: 22px; margin: 0 0 4px 0; color: #0f172a; }
          h2 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 3px; margin: 16px 0 8px 0; }
          .contact { font-size: 11px; color: #475569; margin-bottom: 16px; }
          .section { margin-bottom: 14px; }
          .exp-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; }
          .exp-sub { font-size: 11px; color: #64748b; margin-bottom: 4px; }
          ul { margin: 4px 0 8px 18px; padding: 0; }
          li { margin-bottom: 3px; }
          .skill-pill { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin: 2px 4px 2px 0; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Exports candidate resume data to formatted Word DOCX document
 */
export function exportToDocx(profile: CandidateProfile, filename: string = "Tailored_Resume.docx"): void {
  const content = `
    ================================================================================
    ${profile.name.toUpperCase()}
    ${profile.email} | ${profile.phone} | ${profile.location}
    LinkedIn: ${profile.linkedinUrl || "N/A"} | GitHub: ${profile.githubUrl || "N/A"}
    ================================================================================

    PROFESSIONAL SUMMARY
    --------------------------------------------------------------------------------
    ${profile.summary}

    TECHNICAL SKILLS
    --------------------------------------------------------------------------------
    • Languages: ${profile.skills.languages.join(", ")}
    • Frameworks & Libraries: ${profile.skills.frameworks.join(", ")}
    • Databases & Cloud: ${profile.skills.databases.join(", ")}
    • Developer Tools: ${profile.skills.tools.join(", ")}

    EXPERIENCE
    --------------------------------------------------------------------------------
    ${profile.experience
      .map(
        (exp) => `
    ${exp.role.toUpperCase()} — ${exp.company} (${exp.location})
    ${exp.startDate} - ${exp.endDate}
    ${exp.highlights.map((h) => `  * ${h}`).join("\n")}
    `
      )
      .join("\n")}

    PROJECTS
    --------------------------------------------------------------------------------
    ${profile.projects
      .map(
        (proj) => `
    ${proj.title} [Tech Stack: ${proj.techStack.join(", ")}]
    ${proj.description}
    ${proj.highlights.map((h) => `  * ${h}`).join("\n")}
    `
      )
      .join("\n")}

    EDUCATION
    --------------------------------------------------------------------------------
    ${profile.education
      .map(
        (edu) => `
    ${edu.degree} — ${edu.institution} (${edu.location})
    Graduation: ${edu.graduationYear} | ${edu.score}
    `
      )
      .join("\n")}

    CERTIFICATIONS & ACHIEVEMENTS
    --------------------------------------------------------------------------------
    ${profile.certifications.map((c) => `• ${c.name} - ${c.issuer} (${c.year})`).join("\n")}
    ${profile.achievements.map((a) => `• ${a}`).join("\n")}
  `;

  const blob = new Blob([content], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".docx") ? filename : `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
