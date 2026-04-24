# backend/routers/loan_router.py
from fastapi import APIRouter
import math

router = APIRouter(prefix="/loan", tags=["loan"])

@router.get("/")
def calculate_emi(amount: float, rate: float, years: int):
    # rate is annual percentage, convert to monthly decimal
    monthly_rate = rate / (12 * 100)
    months = years * 12
    
    if monthly_rate == 0:
        emi = amount / months
    else:
        emi = (amount * monthly_rate * math.pow(1 + monthly_rate, months)) / (math.pow(1 + monthly_rate, months) - 1)
        
    total_payable = emi * months
    total_interest = total_payable - amount
    
    return {
        "monthly_emi": round(emi, 2),
        "total_payable": round(total_payable, 2),
        "total_interest": round(total_interest, 2)
    }
