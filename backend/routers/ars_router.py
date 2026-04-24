# backend/routers/ars_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from .. import schemas, models, database, auth

router = APIRouter(prefix="/ars", tags=["ars"])

def calculate_ars(gpa: float, test_score: int, budget: int) -> float:
    # GPA component (max 40)
    gpa_score = (gpa / 4.0) * 40
    # Test score component (max 40, assuming SAT-like 1600 base)
    test_comp = (test_score / 1600) * 40
    # Budget score (max 20) - higher budget helps but cap at 50k for full 20 points
    budget_score = min((budget / 50000) * 20, 20)
    
    total = gpa_score + test_comp + budget_score
    return max(0, min(100, total))

@router.get("/", response_model=schemas.ARSScore)
def get_ars_score(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Profile required to calculate ARS")
    
    score = calculate_ars(profile.gpa, profile.test_score, profile.budget)
    
    # Save or update score in DB
    db_ars = db.query(models.ARS).filter(models.ARS.user_id == current_user.id).first()
    if db_ars:
        db_ars.score = score
        db_ars.last_calculated = datetime.utcnow().isoformat()
    else:
        db_ars = models.ARS(user_id=current_user.id, score=score, last_calculated=datetime.utcnow().isoformat())
        db.add(db_ars)
    
    db.commit()
    return {"score": score, "user_id": current_user.id}
