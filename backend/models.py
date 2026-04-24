# backend/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="student") # student, admin

    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gpa = Column(Float)
    test_score = Column(Integer) # e.g. GRE/SAT/TOEFL
    budget = Column(Integer) # Yearly budget
    target_country = Column(String)
    preferred_course = Column(String)

    user = relationship("User", back_populates="profile")

class ARS(Base):
    __tablename__ = "ars_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    last_calculated = Column(String)
