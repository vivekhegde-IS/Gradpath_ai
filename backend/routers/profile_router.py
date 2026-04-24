# backend/routers/profile_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database, auth

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/", response_model=schemas.Profile)
def get_profile(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.post("/", response_model=schemas.Profile)
def create_profile(profile: schemas.ProfileCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if db_profile:
        # Update existing
        for key, value in profile.dict().items():
            setattr(db_profile, key, value)
    else:
        # Create new
        db_profile = models.Profile(**profile.dict(), user_id=current_user.id)
        db.add(db_profile)
    
    db.commit()
    db.refresh(db_profile)
    return db_profile
