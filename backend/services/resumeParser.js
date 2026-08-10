import fs from "fs/promises";
import path from "path";

export const extractResumeText = async (filePath) => {
  try {
    if (!filePath) return "";
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".pdf") {
      try {
        const { default: pdfParse } = await import("pdf-parse");
        const buffer = await fs.readFile(filePath);
        const data = await pdfParse(buffer);
        return data?.text || "";
      } catch (err) {
        console.warn("pdf-parse unavailable or failed:", err?.message || err);
        return "";
      }
    }

    if (ext === ".docx" || ext === ".doc") {
      try {
        const { default: mammoth } = await import("mammoth");
        const result = await mammoth.extractRawText({ path: filePath });
        return result?.value || "";
      } catch (err) {
        console.warn("mammoth unavailable or failed:", err?.message || err);
        return "";
      }
    }

    try {
      const content = await fs.readFile(filePath, "utf8");
      return content || "";
    } catch (err) {
      console.warn("Failed to read resume as text:", err?.message || err);
      return "";
    }
  } catch (error) {
    console.error("extractResumeText error:", error);
    return "";
  }
};