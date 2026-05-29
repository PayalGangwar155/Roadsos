from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    name: str
    phone: str
    email: str
    avatar_initials: Optional[str] = None  

class Hazard(BaseModel):
    latitude: float
    longitude: float
    type: str          
    description: str
    location_name: Optional[str] = None   
    alternate_route: Optional[str] = None 

class SOS(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    emergency: str     
    status: Optional[str] = "Pending"  
    timestamp: Optional[datetime] = None

class Chat(BaseModel):
    user_id: str
    message: str

class NearbyService(BaseModel):
    name: str           
    type: str           
    distance_km: float  
    rating: float       
    is_open: bool
    latitude: float
    longitude: float

class Activity(BaseModel):
    user_id: str
    title: str          
    subtitle: str       
    status: str         
    time_ago: str       
    icon_type: str      