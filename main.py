from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "RoadSOS Backend Running "}
from routes import user
app.include_router(user.router)
from routes import hazard
app.include_router(hazard.router)
from routes import chatbot
app.include_router(chatbot.router)
from routes import sos
app.include_router(sos.router)