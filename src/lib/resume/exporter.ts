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
    alert("Please allow popups in your browser to download/print the PDF resume.");
    return;
  }

  // Grab all parent document stylesheets and font links
  const headStyles = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
    .map((node) => node.outerHTML)
    .join("\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${filename.replace(/\.pdf$/i, "")}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&display=swap" rel="stylesheet" />
        ${headStyles}
        <style>
          /* High-Definition ATS Print Engine */
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }

          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            color: #0f172a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 11.5px;
            line-height: 1.45;
            -webkit-font-smoothing: antialiased;
          }

          /* Floating Print Toolbar */
          .print-toolbar {
            position: sticky;
            top: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #0f172a;
            color: #ffffff;
            padding: 12px 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: 'Inter', sans-serif;
          }

          .print-toolbar-title {
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .print-toolbar-badge {
            background: #22c55e;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 9999px;
            text-transform: uppercase;
          }

          .print-btn-primary {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 8px 18px;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
            transition: all 0.2s ease;
          }

          .print-btn-primary:hover {
            opacity: 0.95;
            transform: translateY(-1px);
          }

          .print-btn-secondary {
            background: #334155;
            color: #f8fafc;
            border: 1px solid #475569;
            border-radius: 8px;
            padding: 8px 14px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          }

          /* A4 Resume Container */
          .resume-preview-wrapper {
            max-width: 210mm;
            margin: 24px auto;
            background: #ffffff;
            padding: 28px 32px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }

          #resume-document-node {
            background: #ffffff !important;
            color: #0f172a !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }

          /* Tailwind & Layout Fallback Engine */
          .font-serif { font-family: 'Merriweather', Georgia, Cambria, serif !important; }
          .font-sans { font-family: 'Inter', -apple-system, sans-serif !important; }
          .font-mono { font-family: 'JetBrains Mono', Consolas, monospace !important; }

          .text-slate-900 { color: #0f172a !important; }
          .text-slate-800 { color: #1e293b !important; }
          .text-slate-700 { color: #334155 !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .text-blue-700 { color: #1d4ed8 !important; }
          .text-blue-800 { color: #1e40af !important; }
          .text-amber-900 { color: #78350f !important; }

          .bg-white { background-color: #ffffff !important; }
          .bg-slate-50 { background-color: #f8fafc !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
          .bg-blue-100 { background-color: #dbeafe !important; }
          .bg-amber-100 { background-color: #fef3c7 !important; }

          .flex { display: flex !important; }
          .flex-wrap { flex-wrap: wrap !important; }
          .items-center { align-items: center !important; }
          .items-start { align-items: flex-start !important; }
          .items-end { align-items: flex-end !important; }
          .justify-between { justify-content: space-between !important; }

          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .gap-1 { gap: 0.25rem !important; }
          .gap-1\.5 { gap: 0.375rem !important; }
          .gap-2 { gap: 0.5rem !important; }
          .gap-3 { gap: 0.75rem !important; }
          .gap-4 { gap: 1rem !important; }
          .gap-6 { gap: 1.5rem !important; }

          .space-y-0\.5 > * + * { margin-top: 0.125rem !important; }
          .space-y-1 > * + * { margin-top: 0.25rem !important; }
          .space-y-1\.5 > * + * { margin-top: 0.375rem !important; }
          .space-y-2 > * + * { margin-top: 0.5rem !important; }
          .space-y-2\.5 > * + * { margin-top: 0.625rem !important; }
          .space-y-3 > * + * { margin-top: 0.75rem !important; }
          .space-y-4 > * + * { margin-top: 1rem !important; }
          .space-y-5 > * + * { margin-top: 1.25rem !important; }

          .border { border: 1px solid #e2e8f0 !important; }
          .border-b { border-bottom: 1px solid #e2e8f0 !important; }
          .border-b-2 { border-bottom: 2px solid #0f172a !important; }
          .border-l-2 { border-left: 2px solid #cbd5e1 !important; }
          .border-l-4 { border-left: 4px solid #2563eb !important; }
          .border-t { border-top: 1px solid #e2e8f0 !important; }
          .border-slate-200 { border-color: #e2e8f0 !important; }
          .border-slate-300 { border-color: #cbd5e1 !important; }
          .border-slate-900 { border-color: #0f172a !important; }
          .border-blue-600 { border-color: #2563eb !important; }

          .rounded { border-radius: 4px !important; }
          .rounded-md { border-radius: 6px !important; }
          .rounded-lg { border-radius: 8px !important; }
          .rounded-xl { border-radius: 12px !important; }
          .rounded-full { border-radius: 9999px !important; }

          .p-1 { padding: 0.25rem !important; }
          .p-1\.5 { padding: 0.375rem !important; }
          .p-2 { padding: 0.5rem !important; }
          .p-2\.5 { padding: 0.625rem !important; }
          .p-3 { padding: 0.75rem !important; }
          .p-4 { padding: 1rem !important; }
          .p-6 { padding: 1.5rem !important; }
          .p-9 { padding: 0 !important; }
          .p-10 { padding: 0 !important; }
          .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
          .px-2\.5 { padding-left: 0.625rem !important; padding-right: 0.625rem !important; }
          .py-0\.5 { padding-top: 0.125rem !important; padding-bottom: 0.125rem !important; }
          .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
          .pb-0\.5 { padding-bottom: 0.125rem !important; }
          .pb-3 { padding-bottom: 0.75rem !important; }
          .pb-4 { padding-bottom: 1rem !important; }
          .pl-3 { padding-left: 0.75rem !important; }
          .pl-4 { padding-left: 1rem !important; }
          .pt-0\.5 { padding-top: 0.125rem !important; }
          .pt-1 { padding-top: 0.25rem !important; }
          .pt-2 { padding-top: 0.5rem !important; }

          .font-black { font-weight: 900 !important; }
          .font-extrabold { font-weight: 800 !important; }
          .font-bold { font-weight: 700 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-medium { font-weight: 500 !important; }
          .font-normal { font-weight: 400 !important; }

          .text-2xl { font-size: 1.5rem !important; line-height: 1.2 !important; margin: 0 0 4px 0 !important; }
          .text-xl { font-size: 1.25rem !important; }
          .text-sm { font-size: 0.875rem !important; }
          .text-xs { font-size: 0.75rem !important; }
          .text-\[11px\] { font-size: 11px !important; }
          .text-\[10px\] { font-size: 10px !important; }

          .tracking-tight { letter-spacing: -0.025em !important; }
          .tracking-wide { letter-spacing: 0.025em !important; }
          .tracking-wider { letter-spacing: 0.05em !important; }
          .tracking-widest { letter-spacing: 0.1em !important; }
          .uppercase { text-transform: uppercase !important; }
          .leading-normal { line-height: 1.45 !important; }
          .leading-relaxed { line-height: 1.55 !important; }

          ul {
            margin: 4px 0 6px 18px !important;
            padding: 0 !important;
            list-style-type: disc !important;
          }

          li {
            margin-bottom: 2px !important;
            line-height: 1.4 !important;
          }

          p {
            margin: 0 0 3px 0 !important;
          }

          a {
            color: #2563eb !important;
            text-decoration: none !important;
          }

          /* Prevent weird page split in PDF */
          .space-y-1, .space-y-1\.5, .space-y-2, .space-y-2\.5, .space-y-3, .space-y-4, .space-y-5 {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Print Override */
          @media print {
            body {
              background: #ffffff !important;
              padding: 0 !important;
            }

            .no-print {
              display: none !important;
            }

            .resume-preview-wrapper {
              margin: 0 !important;
              padding: 0 !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-toolbar no-print">
          <div class="print-toolbar-title">
            <span>📄 ${filename}</span>
            <span class="print-toolbar-badge">ATS Formatted</span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="print-btn-secondary" onclick="window.close()">✕ Close</button>
            <button class="print-btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
          </div>
        </div>

        <div class="resume-preview-wrapper">
          ${element.outerHTML}
        </div>

        <script>
          // Automatically prompt print dialog on ready
          window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
              window.print();
            }, 450);
          });
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
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
