from fastapi import APIRouter
from database import db

router = APIRouter()

@router.post("/chat")
def save_chat(chat: dict):
    db.chats.insert_one(chat)
    return {"message": "Chat saved"}