# backend/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .routers import auth_router, profile_router, ars_router, ai_router, university_router, loan_router, admin_router

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="GradPath AI API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(profile_router.router)
app.include_router(ars_router.router)
app.include_router(ai_router.router)
app.include_router(university_router.router)
app.include_router(loan_router.router)
app.include_router(admin_router.router)

@app.get("/")
async def root():
    return {"message": "Welcome to GradPath AI API", "docs": "/docs"}
