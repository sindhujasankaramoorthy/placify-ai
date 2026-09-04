declare module "html2pdf.js" {
  export interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: "jpeg" | "png" | "webp"; quality?: number };
    html2canvas?: { scale?: number; useCORS?: boolean; logging?: boolean; letterRendering?: boolean };
    jsPDF?: { unit?: string; format?: string | [number, number]; orientation?: "portrait" | "landscape" };
    pagebreak?: { mode?: string | string[]; before?: string | string[]; after?: string | string[]; avoid?: string | string[] };
  }

  export interface Html2PdfWorker {
    from(element: HTMLElement): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    save(): Promise<void>;
    outputPdf(type?: string): Promise<unknown>;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2PdfWorker;
  export default html2pdf;
}
