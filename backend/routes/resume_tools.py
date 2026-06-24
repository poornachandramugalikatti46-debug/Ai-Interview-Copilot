import io
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from PyPDF2 import PdfReader
from backend.auth import get_current_user
from backend.utils.ai_service import check_ats_score, analyze_keyword_gap, build_ai_resume

router = APIRouter()


class ATSRequest(BaseModel):
    resume_text: str
    job_description: str


class KeywordRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeBuilderRequest(BaseModel):
    name: str
    role: str
    experience: str
    skills: str
    work_history: str
    education: str
    projects: Optional[str] = ""
    achievements: Optional[str] = ""
    target_job: Optional[str] = ""


@router.post("/ats-score")
async def ats_score(data: ATSRequest, current=Depends(get_current_user)):
    if not data.resume_text.strip():
        raise HTTPException(400, "Resume text is required.")
    if not data.job_description.strip():
        raise HTTPException(400, "Job description is required.")
    try:
        result = await check_ats_score(data.resume_text, data.job_description)
        return result
    except Exception as e:
        raise HTTPException(500, f"ATS analysis failed: {e}")


@router.post("/keyword-gap")
async def keyword_gap(data: KeywordRequest, current=Depends(get_current_user)):
    if not data.resume_text.strip() or not data.job_description.strip():
        raise HTTPException(400, "Both resume text and job description required.")
    try:
        result = await analyze_keyword_gap(data.resume_text, data.job_description)
        return result
    except Exception as e:
        raise HTTPException(500, f"Keyword analysis failed: {e}")


@router.post("/build-resume")
async def build_resume(data: ResumeBuilderRequest, current=Depends(get_current_user)):
    try:
        result = await build_ai_resume(data.dict())
        return result
    except Exception as e:
        raise HTTPException(500, f"Resume build failed: {e}")


@router.post("/extract-text")
async def extract_pdf_text(
    file: UploadFile = File(...),
    current=Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(400, "PDF files only.")
    contents = await file.read()
    try:
        text = ""
        reader = PdfReader(io.BytesIO(contents))
        for page in reader.pages:
            text += (page.extract_text() or "") + "\n"
        return {"text": text, "pages": len(reader.pages)}
    except Exception as e:
        raise HTTPException(500, f"PDF extraction failed: {e}")