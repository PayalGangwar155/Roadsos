from fastapi import APIRouter
from database import db
from models import Hazard

router = APIRouter()

@router.post("/report-hazard")
def report_hazard(hazard: Hazard):
    db.hazards.insert_one(hazard.model_dump())
    return {"message": "Hazard reported"}

@router.get("/hazards/active")
def get_active_hazards(latitude: float, longitude: float):
    hazards = list(db.hazards.find())
    return {"hazards": hazards}
