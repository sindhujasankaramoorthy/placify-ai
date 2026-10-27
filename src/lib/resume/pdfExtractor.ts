import { extractText } from "unpdf";
import mammoth from "mammoth";

/**
 * Sanitizes text extracted from PDF or binary documents:
 * - Strips PDF internal metadata, bytecode, and magic headers
 * - Cleans up control characters while preserving lines and paragraphs
 */
export function sanitizeExtractedText(raw: string): string {
  if (!raw) return "";

  // Split into lines and filter out raw PDF structural bytecode lines
  const lines = raw.split(/\r\n|\r|\n/);
  const cleanLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Filter out PDF bytecode and object markers
    if (
      trimmed.startsWith("%PDF-") ||
      trimmed.startsWith("%%EOF") ||
      /^%\w+/.test(trimmed) ||
      /^\d+\s+\d+\s+obj\b/.test(trimmed) ||
      trimmed === "endobj" ||
      trimmed === "stream" ||
      trimmed === "endstream" ||
      trimmed === "xref" ||
      trimmed === "trailer" ||
      trimmed.startsWith("startxref") ||
      trimmed.startsWith("<<") ||
      trimmed.endsWith(">>") ||
      (trimmed.startsWith("/") && !trimmed.includes(" ") && trimmed.length < 30)
    ) {
      continue;
    }

    // Clean unprintable characters
    const sanitizedLine = trimmed
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[ \t]+/g, " ");

    if (sanitizedLine.trim().length > 0) {
      cleanLines.push(sanitizedLine.trim());
    }
  }

  return cleanLines.join("\n");
}

/**
 * Extracts plain text from raw PDF streams if FlateDecode or uncompressed text is present.
 * Uses native DecompressionStream where available.
 */
async function extractFromPdfRawStreams(uint8: Uint8Array): Promise<string> {
  const binaryString = new TextDecoder("latin1").decode(uint8);
  const collectedStrings: string[] = [];

  // Match uncompressed stream blocks: stream ... endstream
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(binaryString)) !== null) {
    const streamContent = match[1];

    // Try extracting plain text operators inside BT ... ET
    const textBlockRegex = /BT([\s\S]*?)ET/g;
    let textBlock: RegExpExecArray | null;
    let foundTextInBlock = false;

    while ((textBlock = textBlockRegex.exec(streamContent)) !== null) {
      const blockContent = textBlock[1];
      // Match parenthesized text: (Hello World) Tj or [(Hello) 10 (World)] TJ
      const stringMatches = blockContent.matchAll(/\(([^)]*)\)\s*(?:Tj|'|")/g);
      for (const sm of stringMatches) {
        if (sm[1] && sm[1].trim().length > 0) {
          collectedStrings.push(sm[1].trim());
          foundTextInBlock = true;
        }
      }

      const tjArrayMatches = blockContent.matchAll(/\[(.*?)\]\s*TJ/g);
      for (const tm of tjArrayMatches) {
        const innerStrings = tm[1].matchAll(/\(([^)]*)\)/g);
        for (const is of innerStrings) {
          if (is[1] && is[1].trim().length > 0) {
            collectedStrings.push(is[1].trim());
            foundTextInBlock = true;
          }
        }
      }
    }

    // If stream is compressed and DecompressionStream is available, attempt inflate
    if (!foundTextInBlock && typeof DecompressionStream !== "undefined") {
      try {
        const startIdx = match.index + match[0].indexOf("\n") + 1;
        const endIdx = match.index + match[0].lastIndexOf("endstream") - 1;
        if (endIdx > startIdx) {
          const slice = uint8.subarray(startIdx, endIdx);
          const decompressedStream = new Response(slice as any).body?.pipeThrough(
            new DecompressionStream("deflate")
          );
          if (decompressedStream) {
            const decompressedBuffer = await new Response(decompressedStream).arrayBuffer();
            const decompText = new TextDecoder("latin1").decode(decompressedBuffer);
            const subMatches = decompText.matchAll(/\(([^)]{2,})\)\s*(?:Tj|'|")/g);
            for (const sm of subMatches) {
              collectedStrings.push(sm[1].trim());
            }
          }
        }
      } catch {
        // stream was not standard raw deflate or was encrypted, continue
      }
    }
  }

  // Also check for standalone email, URLs, and phone patterns directly in the binary
  const emailMatch = binaryString.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (emailMatch) {
    collectedStrings.push(...emailMatch);
  }

  return collectedStrings.join("\n");
}

/**
 * Universal text extractor that extracts clean, human-readable text from any resume file:
 * Handles PDF (unpdf + pdfjs-dist + stream parser), Word DOCX (mammoth), and plain text.
 */
export async function extractTextFromAnyFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. PDF Documents
  if (fileName.endsWith(".pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      // Attempt 1: unpdf extraction
      try {
        const pdfResult = await extractText(uint8, { mergePages: true });
        let text = "";
        if (typeof pdfResult.text === "string") {
          text = pdfResult.text;
        } else if (Array.isArray(pdfResult.text)) {
          text = (pdfResult.text as string[]).join("\n\n");
        }

        const clean = sanitizeExtractedText(text);
        if (clean.length > 30) {
          return clean;
        }
      } catch (unpdfErr) {
        console.warn("unpdf extraction failed, attempting pdfjs-dist fallback:", unpdfErr);
      }

      // Attempt 2: pdfjs-dist dynamic import
      try {
        const pdfjs = await import("pdfjs-dist");
        const doc = await pdfjs.getDocument({ data: uint8, useSystemFonts: true }).promise;
        const pageTexts: string[] = [];

        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const pageStr = content.items
            .map((item: any) => ("str" in item ? item.str : ""))
            .join(" ");
          pageTexts.push(pageStr);
        }

        const clean = sanitizeExtractedText(pageTexts.join("\n\n"));
        if (clean.length > 30) {
          return clean;
        }
      } catch (pdfjsErr) {
        console.warn("pdfjs-dist fallback failed, attempting stream decoder:", pdfjsErr);
      }

      // Attempt 3: Pure JS PDF stream decoder
      const streamText = await extractFromPdfRawStreams(uint8);
      const cleanStream = sanitizeExtractedText(streamText);
      if (cleanStream.length > 20) {
        return cleanStream;
      }
    } catch (err) {
      console.error("Critical error in PDF extraction pipeline:", err);
    }

    return "";
  }

  // 2. Word DOCX Documents
  if (fileName.endsWith(".docx")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const clean = sanitizeExtractedText(result.value || "");
      if (clean.length > 0) return clean;
    } catch (docxErr) {
      console.error("Mammoth DOCX extraction error:", docxErr);
    }
  }

  // 3. Plain text files (.txt, .md, .json)
  if (fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".json")) {
    try {
      const raw = await file.text();
      return sanitizeExtractedText(raw);
    } catch {
      return "";
    }
  }

  return "";
}
