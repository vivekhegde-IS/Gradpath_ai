# backend/schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class ProfileBase(BaseModel):
    gpa: float
    test_score: int
    budget: int
    target_country: str
    preferred_course: str

class ProfileCreate(ProfileBase):
    pass

class Profile(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ARSScore(BaseModel):
    score: float
    user_id: int

class AIChatRequest(BaseModel):
    message: str

class AIChatResponse(BaseModel):
    response: str

class UniversityFilter(BaseModel):
    gpa: Optional[float] = None
    budget: Optional[int] = None
    country: Optional[str] = None

class University(BaseModel):
    name: str
    country: str
    min_gpa: float
    max_budget: int
    courses: List[str]
    tuition: Optional[int] = None
    avg_salary: Optional[int] = None
    ranking: Optional[int] = None
