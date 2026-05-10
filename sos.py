from fastapi import APIRouter
from database import db

router = APIRouter()

@router.post("/sos")
def trigger_sos(data: dict):
    db.sos.insert_one(data)
    return {"message": "SOS triggered"}