import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractPdfText = async (buffer) => {
  if (!buffer) {
    throw new Error("PDF buffer is missing");
  }

  const uint8Array = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
  });

  const pdf = await loadingTask.promise;

  let fullText = "";

  console.log(`📄 PDF pages: ${pdf.numPages}`);

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ");

    fullText += pageText + "\n";

    console.log(
      `📄 Page ${pageNumber}: ${pageText.length} characters`
    );
  }

  return fullText.replace(/\s+/g, " ").trim();
};
