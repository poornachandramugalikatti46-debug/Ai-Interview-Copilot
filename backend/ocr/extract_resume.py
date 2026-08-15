import json
import os
import sys

import pytesseract
from pdf2image import convert_from_path


def extract_text_from_pdf(pdf_path, tesseract_path=None, poppler_path=None):
    try:
        if tesseract_path and os.path.exists(tesseract_path):
            pytesseract.pytesseract.tesseract_cmd = tesseract_path

        kwargs = {"dpi": 200}
        if poppler_path and os.path.exists(poppler_path):
            kwargs["poppler_path"] = poppler_path

        pages = convert_from_path(pdf_path, **kwargs)

        text_parts = []
        for index, page in enumerate(pages, start=1):
            page_text = pytesseract.image_to_string(page, lang="eng")
            if page_text and page_text.strip():
                text_parts.append(page_text)

        final_text = "\n".join(text_parts).strip()
        return {"success": bool(final_text), "text": final_text}

    except Exception as exc:  # pragma: no cover
        return {"success": False, "text": "", "error": str(exc)}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "text": "", "error": "PDF path is required"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    tesseract_path = sys.argv[2] if len(sys.argv) > 2 else None
    poppler_path = sys.argv[3] if len(sys.argv) > 3 else None

    result = extract_text_from_pdf(pdf_path, tesseract_path=tesseract_path, poppler_path=poppler_path)
    print(json.dumps(result))
