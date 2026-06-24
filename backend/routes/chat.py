from fastapi import APIRouter
from pydantic import BaseModel
from backend.services.gemini_service import ask_ai

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/message")
async def chat(req: ChatRequest):

    reply = ask_ai(req.message)

    return {
        "reply": reply
    }