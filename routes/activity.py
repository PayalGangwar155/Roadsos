from fastapi import APIRouter
from database import db

router = APIRouter()

@router.get("/activity/{user_id}")
def get_activity(user_id: str):
    activities = list(db.sos.find({"user_id": user_id}))
    return {"activities": activities}