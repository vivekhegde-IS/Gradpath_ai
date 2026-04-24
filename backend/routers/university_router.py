# backend/routers/university_router.py
import json
import os
from typing import List
from fastapi import APIRouter, Depends
from .. import schemas, models, auth

router = APIRouter(prefix="/universities", tags=["universities"])

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "universities.json")

@router.post("/", response_model=List[schemas.University])
def get_universities(filters: schemas.UniversityFilter, current_user: models.User = Depends(auth.get_current_user)):
    with open(DATA_PATH, "r") as f:
        universities = json.load(f)
    
    results = []
    for uni in universities:
        match = True
        if filters.gpa and uni["min_gpa"] > filters.gpa:
            match = False
        if filters.budget and uni["max_budget"] > filters.budget:
            # Note: filter budget means student's budget. max_budget in data means tuition cost.
            # So if student's budget < tuition, no match.
            if filters.budget < uni["max_budget"]:
                match = False
        if filters.country and uni["country"].lower() != filters.country.lower():
            match = False
        
        if match:
            results.append(uni)
            
    return results
