from pydantic import BaseModel

class User(BaseModel):
    name: str
    phone: str
    email: str

class Hazard(BaseModel):
    latitude: float
    longitude: float
    type: str
    description: str

class SOS(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    emergency: str

class Chat(BaseModel):
    user_id: str
    message: str
