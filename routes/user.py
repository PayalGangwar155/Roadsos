from fastapi import APIRouter
from database import db
from models import User

router = APIRouter()

@router.post("/signup")
def signup(user: User):
    db.users.insert_one(user.model_dump())
    return {"message": "User created"}

@router.post("/login")
def login(phone: str, password: str):
    user = db.users.find_one({"phone": phone})
    if user:
        return {
            "user_id": str(user["_id"]),
            "name": user["name"],
            "avatar_initials": user["name"][0:2].upper()
        }
    return {"error": "User not found"}

@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    user = db.users.find_one({"_id": user_id})
    return user