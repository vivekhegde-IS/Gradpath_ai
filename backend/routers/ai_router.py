# backend/routers/ai_router.py
import os
import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database, auth

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat", response_model=schemas.AIChatResponse)
async def ai_chat(request: schemas.AIChatRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")
    
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    profile_context = "No profile set yet."
    if profile:
        profile_context = f"GPA: {profile.gpa}, Test Score: {profile.test_score}, Budget: {profile.budget}, Target: {profile.target_country}, Course: {profile.preferred_course}"
    
    genai.configure(api_key=gemini_key)
    model = genai.GenerativeModel("gemini-3-flash-preview")
    
    system_prompt = (
        "You are GradPath AI, a mentor. Always personalize using student profile. "
        "Strictly follow this response structure:\n"
        "Insight: <analysis>\n"
        "Recommendation: <suggestions>\n"
        "Next Action: <steps>\n\n"
        f"Student Profile:\n{profile_context}\n\n"
        "Student Question:\n"
    )
    
    try:
        response = await model.generate_content_async(system_prompt + request.message)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
