# backend/routers/admin_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models, database, auth

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[schemas.User])
def list_users(admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(database.get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/stats")
def get_stats(admin: models.User = Depends(auth.get_admin_user), db: Session = Depends(database.get_db)):
    total_users = db.query(models.User).count()
    total_profiles = db.query(models.Profile).count()
    avg_gpa = db.query(models.Profile).with_entities(models.Profile.gpa).all()
    
    gpa_values = [p[0] for p in avg_gpa if p[0] is not None]
    avg_gpa_val = sum(gpa_values) / len(gpa_values) if gpa_values else 0
    
    return {
        "total_users": total_users,
        "total_profiles": total_profiles,
        "average_gpa": round(avg_gpa_val, 2)
    }
