# backend/seed.py
import sys
import os
from datetime import datetime

# Add the parent directory to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine
from backend import models, auth

def seed():
    # Create tables
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. Create Admin User
    admin_email = "admin@test.com"
    if not db.query(models.User).filter(models.User.email == admin_email).first():
        admin_user = models.User(
            email=admin_email,
            hashed_password=auth.get_password_hash("admin1234"),
            role="admin"
        )
        db.add(admin_user)
        print(f"Created admin user: {admin_email}")

    # 2. Create Student User
    student_email = "student@test.com"
    student = db.query(models.User).filter(models.User.email == student_email).first()
    if not student:
        student = models.User(
            email=student_email,
            hashed_password=auth.get_password_hash("test1234"),
            role="student"
        )
        db.add(student)
        db.flush() # Get ID
        print(f"Created student user: {student_email}")
        
        # 3. Create Profile for Student
        profile = models.Profile(
            user_id=student.id,
            gpa=3.7,
            test_score=1350,
            budget=45000,
            target_country="Germany",
            preferred_course="Computer Science"
        )
        db.add(profile)
        print("Created sample profile for student")
        
        # 4. Create ARS Score
        ars = models.ARS(
            user_id=student.id,
            score=72.5,
            last_calculated=datetime.utcnow().isoformat()
        )
        db.add(ars)
        print("Created sample ARS score for student")

    db.commit()
    db.close()
    print("Seed complete.")

if __name__ == "__main__":
    seed()
