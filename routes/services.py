from fastapi import APIRouter
from database import db
from models import NearbyService

router = APIRouter()

@router.get("/services/nearby")
def get_nearby_services(
    latitude: float,
    longitude: float,
    type: str = None   
):
    query = {}
    if type:
        query["type"] = type
    services = list(db.services.find(query))
    return {"services": services}

@router.post("/services/request")
def request_service(
    user_id: str,
    service_type: str,  
    latitude: float,
    longitude: float
):
    db.service_requests.insert_one({
        "user_id": user_id,
        "service_type": service_type,
        "latitude": latitude,
        "longitude": longitude,
        "status": "Pending"
    })
    return {"message": f"{service_type} requested", "status": "Pending"}
