from fastapi import APIRouter
from database import db
from models import SOS
from datetime import datetime

router = APIRouter()

@router.post("/sos")
def trigger_sos(data: SOS):
    data.timestamp=datetime.now()
    data.status="Dispatched"
    db.sos.insert_one(data.model_dump())
    return {"message": "SOS triggered",
            "status":"Dispatched",
            "emergency":data.emergency}

@router.get("/sos/status/{sos_id}")
def get_sos_status(sos_id: str):
    sos = db.sos.find_one({"_id": sos_id})
    return {"status": sos["status"]}