import { exportToPdf } from "@/lib/resume/exporter";

interface PdfExportOptions {
  filename?: string;
  elementId?: string;
  element?: HTMLElement | null;
}

/**
 * Export a rendered resume template element to a downloadable A4 PDF document.
 * Uses html2pdf.js when available, and seamlessly falls back to Placify's high-definition print engine.
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

  try {
    const win = typeof window !== "undefined" ? (window as any) : null;
    let html2pdf = win?.html2pdf;

    if (!html2pdf) {
      try {
        const pkg = "html2pdf.js";
        const html2pdfModule = await import(/* @vite-ignore */ pkg);
        html2pdf = html2pdfModule.default || html2pdfModule;
      } catch {
        // Module not yet installed in node_modules, smoothly proceed to high-def print engine
      }
    }

    if (html2pdf && typeof html2pdf === "function") {
      const opt = {
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

      await (html2pdf as any)().from(targetElement).set(opt).save();
      return;
    }
  } catch (err) {
    console.warn("html2pdf rendering failed or module not installed, falling back to high-def print engine:", err);
  }

  // High-fidelity fallback engine already built into Placify
  if (elementId) {
    exportToPdf(elementId, safeFilename);
  } else {
    window.print();
  }
}

/**
 * Browser Print fallback option triggering native print-to-PDF dialog.
 */
export function exportResumePrint(): void {
  window.print();
}
