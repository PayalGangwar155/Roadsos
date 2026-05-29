from fastapi import APIRouter
from database import db

router = APIRouter()

@router.post("/report-hazard")
def report_hazard(hazard: dict):
    db.hazards.insert_one(hazard)
    return {"message": "Hazard reported"}