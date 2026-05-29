from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "RoadSOS Backend Running 🚨"}

from routes import user, hazard, chatbot, sos
# ADD THESE TWO:
from routes import services, activity

app.include_router(user.router)
app.include_router(hazard.router)
app.include_router(chatbot.router)
app.include_router(sos.router)
app.include_router(services.router)   
app.include_router(activity.router)  