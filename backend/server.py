from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import uuid
from typing import List, Optional

from database import (
    profile_collection, experience_collection, education_collection,
    skills_collection, ventures_collection, achievements_collection,
    whitepapers_collection, appointments_collection, analytics_collection
)
from models import (
    Profile, Experience, Education, SkillCategory, Venture,
    Achievements, WhitePaper, Appointment
)

app = FastAPI(title="Ibrahim El Khalil Portfolio API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc and '_id' in doc:
        doc['_id'] = str(doc['_id'])
    return doc

def generate_id():
    """Generate unique ID"""
    return str(uuid.uuid4())

# ==================== ROOT & HEALTH ====================
@app.get("/")
def read_root():
    return {"message": "Ibrahim El Khalil Portfolio API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "portfolio-backend"}

# ==================== PROFILE ====================
@app.get("/api/profile")
def get_profile():
    """Get profile data"""
    profile = profile_collection.find_one({})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return serialize_doc(profile)

@app.put("/api/profile")
def update_profile(profile: Profile):
    """Update profile data"""
    profile_data = profile.dict()
    result = profile_collection.update_one(
        {},
        {"$set": profile_data},
        upsert=True
    )
    return {"success": True, "message": "Profile updated successfully"}

# ==================== EXPERIENCE ====================
@app.get("/api/experience")
def get_experience():
    """Get all experience entries"""
    experiences = list(experience_collection.find({}))
    return [serialize_doc(exp) for exp in experiences]

@app.post("/api/experience")
def create_experience(experience: Experience):
    """Create new experience entry"""
    exp_data = experience.dict()
    exp_data['id'] = generate_id()
    experience_collection.insert_one(exp_data)
    return {"success": True, "id": exp_data['id'], "message": "Experience created"}

@app.put("/api/experience/{exp_id}")
def update_experience(exp_id: str, experience: Experience):
    """Update experience entry"""
    exp_data = experience.dict()
    result = experience_collection.update_one(
        {"id": exp_id},
        {"$set": exp_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"success": True, "message": "Experience updated"}

@app.delete("/api/experience/{exp_id}")
def delete_experience(exp_id: str):
    """Delete experience entry"""
    result = experience_collection.delete_one({"id": exp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"success": True, "message": "Experience deleted"}

# ==================== EDUCATION ====================
@app.get("/api/education")
def get_education():
    """Get all education entries"""
    education = list(education_collection.find({}))
    return [serialize_doc(edu) for edu in education]

@app.post("/api/education")
def create_education(education: Education):
    """Create new education entry"""
    edu_data = education.dict()
    edu_data['id'] = generate_id()
    education_collection.insert_one(edu_data)
    return {"success": True, "id": edu_data['id'], "message": "Education created"}

@app.put("/api/education/{edu_id}")
def update_education(edu_id: str, education: Education):
    """Update education entry"""
    edu_data = education.dict()
    result = education_collection.update_one(
        {"id": edu_id},
        {"$set": edu_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"success": True, "message": "Education updated"}

@app.delete("/api/education/{edu_id}")
def delete_education(edu_id: str):
    """Delete education entry"""
    result = education_collection.delete_one({"id": edu_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"success": True, "message": "Education deleted"}

# ==================== SKILLS ====================
@app.get("/api/skills")
def get_skills():
    """Get all skill categories"""
    skills = list(skills_collection.find({}))
    return [serialize_doc(skill) for skill in skills]

@app.post("/api/skills")
def create_skill_category(skill_category: SkillCategory):
    """Create new skill category"""
    skill_data = skill_category.dict()
    skill_data['id'] = generate_id()
    skills_collection.insert_one(skill_data)
    return {"success": True, "id": skill_data['id'], "message": "Skill category created"}

@app.put("/api/skills/{skill_id}")
def update_skill_category(skill_id: str, skill_category: SkillCategory):
    """Update skill category"""
    skill_data = skill_category.dict()
    result = skills_collection.update_one(
        {"id": skill_id},
        {"$set": skill_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"success": True, "message": "Skill category updated"}

@app.delete("/api/skills/{skill_id}")
def delete_skill_category(skill_id: str):
    """Delete skill category"""
    result = skills_collection.delete_one({"id": skill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"success": True, "message": "Skill category deleted"}

# ==================== VENTURES ====================
@app.get("/api/ventures")
def get_ventures():
    """Get all ventures"""
    ventures = list(ventures_collection.find({}))
    return [serialize_doc(venture) for venture in ventures]

@app.post("/api/ventures")
def create_venture(venture: Venture):
    """Create new venture"""
    venture_data = venture.dict()
    venture_data['id'] = generate_id()
    ventures_collection.insert_one(venture_data)
    return {"success": True, "id": venture_data['id'], "message": "Venture created"}

@app.put("/api/ventures/{venture_id}")
def update_venture(venture_id: str, venture: Venture):
    """Update venture"""
    venture_data = venture.dict()
    result = ventures_collection.update_one(
        {"id": venture_id},
        {"$set": venture_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Venture not found")
    return {"success": True, "message": "Venture updated"}

@app.delete("/api/ventures/{venture_id}")
def delete_venture(venture_id: str):
    """Delete venture"""
    result = ventures_collection.delete_one({"id": venture_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Venture not found")
    return {"success": True, "message": "Venture deleted"}

# ==================== ACHIEVEMENTS ====================
@app.get("/api/achievements")
def get_achievements():
    """Get achievements (certificates and hackathons)"""
    achievements = achievements_collection.find_one({})
    if not achievements:
        return {"certificates": [], "hackathons": []}
    return serialize_doc(achievements)

@app.put("/api/achievements")
def update_achievements(achievements: Achievements):
    """Update achievements"""
    ach_data = achievements.dict()
    result = achievements_collection.update_one(
        {},
        {"$set": ach_data},
        upsert=True
    )
    return {"success": True, "message": "Achievements updated"}

# ==================== WHITE PAPERS ====================
@app.get("/api/whitepapers")
def get_whitepapers():
    """Get all white papers"""
    papers = list(whitepapers_collection.find({}))
    return [serialize_doc(paper) for paper in papers]

@app.post("/api/whitepapers")
def create_whitepaper(whitepaper: WhitePaper):
    """Create new white paper"""
    paper_data = whitepaper.dict()
    paper_data['id'] = generate_id()
    whitepapers_collection.insert_one(paper_data)
    return {"success": True, "id": paper_data['id'], "message": "White paper created"}

@app.put("/api/whitepapers/{paper_id}")
def update_whitepaper(paper_id: str, whitepaper: WhitePaper):
    """Update white paper"""
    paper_data = whitepaper.dict()
    result = whitepapers_collection.update_one(
        {"id": paper_id},
        {"$set": paper_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="White paper not found")
    return {"success": True, "message": "White paper updated"}

@app.delete("/api/whitepapers/{paper_id}")
def delete_whitepaper(paper_id: str):
    """Delete white paper"""
    result = whitepapers_collection.delete_one({"id": paper_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="White paper not found")
    return {"success": True, "message": "White paper deleted"}

# ==================== APPOINTMENTS ====================
@app.get("/api/appointments")
def get_appointments():
    """Get all appointments"""
    appointments = list(appointments_collection.find({}))
    return [serialize_doc(apt) for apt in appointments]

@app.post("/api/appointments")
def create_appointment(appointment: Appointment):
    """Create new appointment"""
    apt_data = appointment.dict()
    apt_data['id'] = generate_id()
    apt_data['created_at'] = datetime.utcnow().isoformat()
    apt_data['status'] = 'pending'
    appointments_collection.insert_one(apt_data)
    
    # Update analytics
    analytics_collection.update_one(
        {},
        {"$inc": {"appointments_booked": 1}}
    )
    
    return {"success": True, "id": apt_data['id'], "message": "Appointment created"}

@app.put("/api/appointments/{apt_id}")
def update_appointment(apt_id: str, appointment: Appointment):
    """Update appointment"""
    apt_data = appointment.dict()
    result = appointments_collection.update_one(
        {"id": apt_id},
        {"$set": apt_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"success": True, "message": "Appointment updated"}

@app.delete("/api/appointments/{apt_id}")
def delete_appointment(apt_id: str):
    """Delete appointment"""
    result = appointments_collection.delete_one({"id": apt_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"success": True, "message": "Appointment deleted"}

# ==================== ANALYTICS ====================
@app.get("/api/analytics")
def get_analytics():
    """Get analytics data"""
    analytics = analytics_collection.find_one({})
    if not analytics:
        return {
            'total_visits': 0,
            'unique_visitors': 0,
            'ai_chat_sessions': 0,
            'appointments_booked': 0,
            'skills_viewed': 0
        }
    return serialize_doc(analytics)

@app.post("/api/analytics/track")
def track_event(event_type: str = Body(..., embed=True)):
    """Track analytics event"""
    valid_events = ['visit', 'ai_chat', 'skills_view']
    
    if event_type == 'visit':
        analytics_collection.update_one(
            {},
            {"$inc": {"total_visits": 1, "unique_visitors": 1}}
        )
    elif event_type == 'ai_chat':
        analytics_collection.update_one(
            {},
            {"$inc": {"ai_chat_sessions": 1}}
        )
    elif event_type == 'skills_view':
        analytics_collection.update_one(
            {},
            {"$inc": {"skills_viewed": 1}}
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid event type")
    
    return {"success": True, "message": "Event tracked"}

# ==================== DATA MIGRATION ====================
@app.post("/api/migrate")
def migrate_data(data: dict = Body(...)):
    """Migrate data from constants.js to MongoDB"""
    try:
        # Migrate Profile
        if 'profile' in data:
            profile_collection.delete_many({})
            profile_collection.insert_one(data['profile'])
        
        # Migrate Experience
        if 'experience' in data:
            experience_collection.delete_many({})
            for exp in data['experience']:
                exp['id'] = generate_id()
                experience_collection.insert_one(exp)
        
        # Migrate Education
        if 'education' in data:
            education_collection.delete_many({})
            for edu in data['education']:
                edu['id'] = generate_id()
                education_collection.insert_one(edu)
        
        # Migrate Skills
        if 'skills' in data:
            skills_collection.delete_many({})
            for skill in data['skills']:
                skill['id'] = generate_id()
                skills_collection.insert_one(skill)
        
        # Migrate Ventures
        if 'ventures' in data:
            ventures_collection.delete_many({})
            for venture in data['ventures']:
                venture['id'] = generate_id()
                ventures_collection.insert_one(venture)
        
        # Migrate Achievements
        if 'achievements' in data:
            achievements_collection.delete_many({})
            achievements_collection.insert_one(data['achievements'])
        
        # Migrate White Papers
        if 'whitepapers' in data:
            whitepapers_collection.delete_many({})
            for paper in data['whitepapers']:
                paper['id'] = generate_id()
                whitepapers_collection.insert_one(paper)
        
        return {"success": True, "message": "Data migrated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Migration failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)