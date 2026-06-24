from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "fresher"
    experience: Optional[str] = "0"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class InterviewRequest(BaseModel):
    job_role: str         # e.g. "Frontend Developer"
    experience_level: str # e.g. "Fresher" or "Experienced"
    question_type: str    # "Technical", "HR", "Behavioral"
    num_questions: Optional[int] = 5

class AnswerEvalRequest(BaseModel):
    question: str
    answer: str
    job_role: str

class AnswerImproveRequest(BaseModel):
    question: str
    answer: str

class ResumeQuestionRequest(BaseModel):
    resume_text: str
    job_role: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class SaveAnswerRequest(BaseModel):
    user_email: str
    question: str
    answer: str
    score: float
    feedback: str