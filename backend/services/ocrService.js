import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TESSERACT_PATH = "C:/Program Files/Tesseract-OCR/tesseract.exe";
const POPPLER_BIN = "C:/Users/PoornaChadru/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin";

export const extractTextWithOCR = (pdfPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "..", "ocr", "extract_resume.py");

    console.log("🔍 OCR script:", scriptPath);
    console.log("📄 PDF path:", pdfPath);

    const python = spawn("python", [
      scriptPath,
      pdfPath,
      TESSERACT_PATH,
      POPPLER_BIN,
    ]);

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    python.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      console.log("🐍 OCR STDERR:", chunk.toString());
    });

    python.on("error", (error) => {
      console.error("❌ Failed to start Python OCR:", error);
      reject(error);
    });

    python.on("close", (code) => {
      console.log("🐍 OCR process exited with code:", code);

      if (code !== 0) {
        reject(new Error(stderr || "OCR process failed"));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        resolve(result);
      } catch (error) {
        console.error("❌ Invalid OCR JSON output:", stdout);
        reject(error);
      }
    });
  });
};
