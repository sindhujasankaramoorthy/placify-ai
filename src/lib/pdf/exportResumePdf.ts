import html2pdf, { Html2PdfOptions } from "html2pdf.js";

interface PdfExportOptions {
  filename?: string;
  elementId?: string;
  element?: HTMLElement | null;
}

/**
 * Export a rendered resume template element to a downloadable A4 PDF document.
 */
export async function exportResumePdf({
  filename = "Resume.pdf",
  elementId = "resume-preview-document",
  element = null,
}: PdfExportOptions = {}): Promise<void> {
  const targetElement = element || (elementId ? document.getElementById(elementId) : null);

  if (!targetElement) {
    throw new Error(`PDF Export Error: Target element '${elementId}' not found in DOM.`);
  }

  // Sanitize filename to ensure valid .pdf extension
  const safeFilename = filename.toLowerCase().endsWith(".pdf")
    ? filename
    : `${filename.replace(/[^a-z0-9_]/gi, "_")}.pdf`;

  const opt: Html2PdfOptions = {
    margin: [8, 8, 8, 8],
    filename: safeFilename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2, // High resolution rendering
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: targetElement.scrollWidth || 800,
    } as any,
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      avoid: ["section", "header", ".space-y-3", ".space-y-4"],
    },
  };

  try {
    await html2pdf().from(targetElement).set(opt).save();
  } catch (err) {
    console.warn("html2pdf rendering failed, triggering fallback print dialog:", err);
    window.print();
  }
}

/**
 * Browser Print fallback option triggering native print-to-PDF dialog.
 */
export function exportResumePrint(): void {
  window.print();
}
