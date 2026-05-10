from fastapi import APIRouter
from database import db

router = APIRouter()

@router.post("/signup")
def signup(user: dict):
    db.users.insert_one(user)
    return {"message": "User created"}