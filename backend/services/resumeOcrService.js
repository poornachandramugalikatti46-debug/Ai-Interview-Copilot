import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "canvas";
import { createWorker } from "tesseract.js";

export const extractResumeTextWithOCR = async (
  buffer
) => {
  let worker = null;

  try {
    console.log("================================");
    console.log("🔍 STARTING RESUME OCR");
    console.log("================================");

    if (!buffer) {
      throw new Error("PDF buffer is missing");
    }

    const uint8Array = new Uint8Array(buffer);

    const pdf = await pdfjsLib
      .getDocument({
        data: uint8Array,
      })
      .promise;

    console.log(`📄 PDF contains ${pdf.numPages} page(s)`);

    worker = await createWorker("eng");

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      try {
        console.log(`🔍 Processing page ${pageNumber}/${pdf.numPages}`);

        const page = await pdf.getPage(pageNumber);

        const viewport = page.getViewport({
          scale: 2,
        });

        const canvas = createCanvas(
          Math.ceil(viewport.width),
          Math.ceil(viewport.height)
        );

        const context = canvas.getContext("2d");

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        const imageBuffer = canvas.toBuffer("image/png");

        const result = await worker.recognize(imageBuffer);

        const pageText = result.data.text || "";

        console.log(
          `✅ Page ${pageNumber}: ${pageText.length} characters`
        );

        if (pageText.trim()) {
          fullText += pageText + "\n";
        }
      } catch (pageError) {
        console.warn(
          `⚠️ Could not OCR page ${pageNumber}:`,
          pageError?.message || pageError
        );
      }
    }

    const cleanedText = fullText
      .replace(/\r/g, " ")
      .replace(/\n+/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    console.log("================================");
    console.log(`📝 TOTAL OCR CHARACTERS: ${cleanedText.length}`);
    console.log("📝 OCR PREVIEW:", cleanedText.substring(0, 1000));
    console.log("================================");

    return cleanedText;
  } catch (error) {
    console.error("❌ OCR extraction failed:", error?.message || error);
    return "";
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
};
