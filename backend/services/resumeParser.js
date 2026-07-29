import fs from "fs";
import path from "path";
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractResumeText = async (filePath) => {
  try {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === ".pdf") {
      const buffer = fs.readFileSync(filePath);
      const parse = pdfParse.default || pdfParse;

      const data = await parse(buffer);

      return data.text;
    }

    if (extension === ".docx") {
      const result = await mammoth.extractRawText({
        path: filePath,
      });

      return result.value;
    }

    return "";
  } catch (error) {
    console.error(error);

    return "";
  }
};