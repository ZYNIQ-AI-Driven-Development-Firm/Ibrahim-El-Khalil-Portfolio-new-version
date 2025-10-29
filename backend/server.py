from fastapi import FastAPI, HTTPException, Body, UploadFile, File, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import os
import uuid
from typing import List, Optional, Annotated
import io
import textwrap
import re
import logging
from fastapi.responses import StreamingResponse

# PDF parsing support
HAS_PDF_PARSER = True
try:
    from PyPDF2 import PdfReader
except Exception:
    HAS_PDF_PARSER = False

# ReportLab is optional at runtime; building/installation may require system toolchain (Rust for some wheels)
HAS_REPORTLAB = True
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
except Exception:
    HAS_REPORTLAB = False

from database import (
    db, profile_collection, experience_collection, education_collection,
    skills_collection, ventures_collection, achievements_collection,
    whitepapers_collection, appointments_collection, analytics_collection,
    blogs_collection, is_mongodb_available
)
from models import (
    Profile, Experience, Education, SkillCategory, Venture,
    Achievements, WhitePaper, Appointment, BlogPost
)
from mem0_service import get_mem0_service

app = FastAPI(title="Ibrahim El Khalil Portfolio API")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS with explicit origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now - restrict in production if needed
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Authentication function for admin endpoints
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'pass@123')

async def verify_admin_auth(authorization: Annotated[str | None, Header()] = None):
    """Verify admin authentication for protected endpoints"""
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Simple password-based auth (could be enhanced with JWT)
    if authorization.replace('Bearer ', '') != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True

# Database availability check
def require_database():
    """Check if database is available and raise error if not"""
    if not is_mongodb_available():
        raise HTTPException(
            status_code=503,
            detail="Database service unavailable. Please check MongoDB connection."
        )

# Global exception handler for better error reporting
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
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

@app.get("/api/system-status")
def system_status():
    """Get comprehensive system status for admin dashboard"""
    import datetime
    import time
    import psutil
    from pymongo.errors import ServerSelectionTimeoutError
    
    try:
        # Measure response time
        start_time = time.time()
        
        # Test database connection
        db_status = {"connected": False, "error": None, "collections": {}}
        db_latency_start = time.time()
        try:
            # Test connection with a simple operation
            db.admin.command('ismaster')
            db_latency = round((time.time() - db_latency_start) * 1000, 2)  # Convert to ms
            db_status["connected"] = True
            db_status["latency"] = f"{db_latency}ms"
            
            # Get collection stats
            collections_info = {
                "profile": {"count": 0, "last_modified": None},
                "experience": {"count": 0, "last_modified": None},
                "education": {"count": 0, "last_modified": None},
                "skills": {"count": 0, "last_modified": None},
                "ventures": {"count": 0, "last_modified": None},
                "achievements": {"count": 0, "last_modified": None},
                "whitepapers": {"count": 0, "last_modified": None},
                "appointments": {"count": 0, "last_modified": None},
            }
            
            # Get document counts and last modified dates
            collections_info["profile"]["count"] = profile_collection.count_documents({})
            collections_info["experience"]["count"] = experience_collection.count_documents({})
            collections_info["education"]["count"] = education_collection.count_documents({})
            collections_info["skills"]["count"] = skills_collection.count_documents({})
            collections_info["ventures"]["count"] = ventures_collection.count_documents({})
            collections_info["achievements"]["count"] = achievements_collection.count_documents({})
            collections_info["whitepapers"]["count"] = whitepapers_collection.count_documents({})
            collections_info["appointments"]["count"] = appointments_collection.count_documents({})
            
            # Get last modified dates (if documents have timestamps)
            for coll_name, collection in [
                ("profile", profile_collection),
                ("experience", experience_collection),
                ("education", education_collection),
                ("skills", skills_collection),
                ("ventures", ventures_collection),
                ("achievements", achievements_collection),
                ("whitepapers", whitepapers_collection),
                ("appointments", appointments_collection),
            ]:
                try:
                    # Try to find the most recent document (works if there's a created_at or _id field)
                    latest_doc = collection.find_one({}, sort=[("_id", -1)])
                    if latest_doc and "_id" in latest_doc:
                        # Extract timestamp from MongoDB ObjectId
                        collections_info[coll_name]["last_modified"] = latest_doc["_id"].generation_time.isoformat()
                except Exception:
                    collections_info[coll_name]["last_modified"] = "Unknown"
            
            db_status["collections"] = collections_info
            
        except ServerSelectionTimeoutError as e:
            db_status["connected"] = False
            db_status["error"] = "Connection timeout"
            db_status["latency"] = "N/A"
        except Exception as e:
            db_status["connected"] = False
            db_status["error"] = str(e)
            db_status["latency"] = "N/A"
        
        # Get system metrics (CPU, Memory)
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            memory_used_gb = round(memory.used / (1024**3), 2)
            memory_total_gb = round(memory.total / (1024**3), 2)
            memory_percent = memory.percent
        except Exception:
            cpu_percent = 0
            memory_used_gb = 0
            memory_total_gb = 0
            memory_percent = 0
        
        # Backend status
        response_time = round((time.time() - start_time) * 1000, 2)  # in ms
        backend_status = {
            "status": "healthy",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "uptime": "Available", # Could implement actual uptime tracking
            "version": "1.0.0",
            "environment": {
                "has_gemini_api": bool(os.getenv('GEMINI_API_KEY')),
                "has_mongo_uri": bool(os.getenv('MONGODB_URI')),
                "port": os.getenv('PORT', '8001')
            }
        }
        
        # Overall system health
        overall_status = "healthy" if db_status["connected"] else "degraded"
        if not backend_status["environment"]["has_gemini_api"]:
            overall_status = "warning"
        if not backend_status["environment"]["has_mongo_uri"]:
            overall_status = "error"
        
        return {
            "overall_status": overall_status,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "response_time": f"{response_time}ms",
            "cpu_usage": f"{cpu_percent}%",
            "memory_usage": f"{memory_used_gb}GB / {memory_total_gb}GB ({memory_percent}%)",
            "uptime": "Available",
            "database": db_status,
            "backend": backend_status,
            "api_endpoints": {
                "total_endpoints": 25,  # Approximate count
                "authenticated_endpoints": 8,
                "public_endpoints": 17
            }
        }
        
    except Exception as e:
        return {
            "overall_status": "error",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "error": f"System status check failed: {str(e)}",
            "database": {"connected": False, "error": "Unknown"},
            "backend": {"status": "error"}
        }

# Handle preflight OPTIONS requests explicitly
@app.options("/{full_path:path}")
def handle_options(full_path: str):
    """Handle preflight OPTIONS requests"""
    from fastapi import Response
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "86400"
    return response

# ==================== PROFILE ====================
@app.get("/api/profile")
def get_profile():
    """Get profile data"""
    require_database()
    try:
        profile = profile_collection.find_one({})
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return serialize_doc(profile)
    except Exception as e:
        logger.error(f"Error getting profile: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.put("/api/profile")
def update_profile(profile: Profile, _: bool = Depends(verify_admin_auth)):
    """Update profile data (Admin only)"""
    require_database()
    try:
        profile_data = profile.dict()
        result = profile_collection.update_one(
            {},
            {"$set": profile_data},
            upsert=True
        )
        return {"success": True, "message": "Profile updated successfully"}
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

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

# ==================== BLOG POSTS ====================
@app.get("/api/blogs")
def get_blogs(status: Optional[str] = None, category: Optional[str] = None, limit: Optional[int] = None):
    """Get all blog posts with optional filtering"""
    try:
        query = {}
        if status:
            query["status"] = status
        if category:
            query["category"] = category
        
        cursor = blogs_collection.find(query).sort("created_at", -1)
        if limit:
            cursor = cursor.limit(limit)
        
        blogs = [serialize_doc(blog) for blog in cursor]
        return blogs
    except Exception as e:
        logger.error(f"Error fetching blogs: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/blogs/{blog_id}")
def get_blog(blog_id: str):
    """Get a single blog post by ID or slug"""
    try:
        # Try to find by ID first, then by slug
        blog = blogs_collection.find_one({"id": blog_id})
        if not blog:
            blog = blogs_collection.find_one({"slug": blog_id})
        
        if not blog:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        # Increment view count
        blogs_collection.update_one(
            {"id": blog.get("id")},
            {"$inc": {"views": 1}}
        )
        
        return serialize_doc(blog)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blogs")
def create_blog(blog: BlogPost):
    """Create a new blog post"""
    try:
        blog_dict = blog.dict(exclude_none=True)
        blog_id = str(uuid.uuid4())
        blog_dict["id"] = blog_id
        blog_dict["created_at"] = datetime.utcnow().isoformat()
        blog_dict["updated_at"] = datetime.utcnow().isoformat()
        
        # Generate slug from title if not provided
        if not blog_dict.get("slug"):
            blog_dict["slug"] = re.sub(r'[^a-z0-9]+', '-', blog_dict["title"].lower()).strip('-')
        
        # Calculate reading time if not provided (approx 200 words per minute)
        if not blog_dict.get("reading_time") and blog_dict.get("content"):
            word_count = len(blog_dict["content"].split())
            blog_dict["reading_time"] = max(1, round(word_count / 200))
        
        blogs_collection.insert_one(blog_dict)
        return serialize_doc(blog_dict)
    except Exception as e:
        logger.error(f"Error creating blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/blogs/{blog_id}")
def update_blog(blog_id: str, blog: BlogPost):
    """Update an existing blog post"""
    try:
        existing_blog = blogs_collection.find_one({"id": blog_id})
        if not existing_blog:
            raise HTTPException(status_code=404, detail="Blog post not found")
        
        blog_dict = blog.dict(exclude_none=True)
        blog_dict["updated_at"] = datetime.utcnow().isoformat()
        
        # Update slug if title changed
        if blog_dict.get("title") and blog_dict["title"] != existing_blog.get("title"):
            if not blog_dict.get("slug"):
                blog_dict["slug"] = re.sub(r'[^a-z0-9]+', '-', blog_dict["title"].lower()).strip('-')
        
        # Recalculate reading time if content changed
        if blog_dict.get("content") and blog_dict["content"] != existing_blog.get("content"):
            word_count = len(blog_dict["content"].split())
            blog_dict["reading_time"] = max(1, round(word_count / 200))
        
        blogs_collection.update_one(
            {"id": blog_id},
            {"$set": blog_dict}
        )
        
        updated_blog = blogs_collection.find_one({"id": blog_id})
        return serialize_doc(updated_blog)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/blogs/{blog_id}")
def delete_blog(blog_id: str):
    """Delete a blog post"""
    try:
        result = blogs_collection.delete_one({"id": blog_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return {"success": True, "message": "Blog post deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/blogs/generate")
async def generate_blog_with_ai(data: dict = Body(...)):
    """Generate blog content using Gemini AI"""
    try:
        topic = data.get("topic", "")
        category = data.get("category", "")
        tone = data.get("tone", "professional")
        length = data.get("length", "medium")
        
        if not topic:
            raise HTTPException(status_code=400, detail="Topic is required")
        
        # Check if Gemini API is available
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key == "your-gemini-api-key-here":
            # Return a demo blog post when API key is not available
            word_count = {"short": 500, "medium": 1000, "long": 1500}.get(length, 1000)
            demo_content = f"""# {topic}

## Introduction

This is a sample blog post about {topic}. This content is generated as a placeholder since the Gemini AI API key is not configured.

## Main Content

To enable AI-powered blog generation, you need to:

1. Get a Gemini API key from Google AI Studio
2. Add it to your environment variables
3. Restart the backend service

## Key Points

- This feature requires a valid Gemini API key
- The AI can generate professional content in various tones
- Blog posts can be customized by length and category
- Generated content includes SEO optimization

## Conclusion

Once properly configured, this feature will generate high-quality blog content tailored to your specifications using Google's Gemini AI model.

*Note: This is demo content. Configure your Gemini API key to enable AI generation.*"""

            return {
                "title": f"Sample: {topic}",
                "excerpt": f"This is a sample blog post about {topic}. Configure Gemini API for AI generation.",
                "content": demo_content,
                "tags": [category, "sample", "demo"] if category else ["sample", "demo"],
                "seo_title": f"{topic} - Sample Blog Post",
                "seo_description": f"Learn about {topic} in this sample blog post. Configure AI for automated content generation.",
                "ai_generated": False,
                "demo": True
            }
        
        # Import Gemini if available
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
        except Exception as e:
            logger.error(f"Failed to configure Gemini: {e}")
            raise HTTPException(status_code=500, detail="Gemini API configuration failed")
        
        # Generate prompt based on parameters
        word_count = {"short": 500, "medium": 1000, "long": 1500}.get(length, 1000)
        
        prompt = f"""Write a professional blog post about: {topic}

Category: {category}
Tone: {tone}
Target length: approximately {word_count} words

Please structure the blog post with:
1. An engaging title
2. A compelling excerpt (2-3 sentences)
3. Well-organized main content with proper headings
4. SEO-friendly keywords
5. A conclusion

Format the response as JSON with the following structure:
{{
    "title": "Blog Title",
    "excerpt": "Brief description...",
    "content": "Full blog content with markdown formatting...",
    "tags": ["tag1", "tag2", "tag3"],
    "seo_title": "SEO optimized title",
    "seo_description": "SEO meta description"
}}"""
        
        response = model.generate_content(prompt)
        
        # Try to parse JSON from response
        import json
        try:
            # Extract JSON from response (handle markdown code blocks)
            text = response.text
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            
            blog_data = json.loads(text.strip())
            blog_data["ai_generated"] = True
            blog_data["demo"] = False
            return blog_data
        except:
            # If JSON parsing fails, return raw content
            return {
                "title": topic,
                "excerpt": "",
                "content": response.text,
                "tags": [category] if category else [],
                "ai_generated": True,
                "demo": False
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating blog with AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

# ==================== ENVIRONMENT VARIABLES ====================
@app.get("/api/env-variables")
def get_env_variables():
    """Get environment variables (for admin dashboard)"""
    # Return safe environment variables (not all, for security)
    safe_vars = {
        'GEMINI_API_KEY': os.getenv('GEMINI_API_KEY', ''),
        'MONGODB_URI': os.getenv('MONGODB_URI', ''),
        'PDF_CONVERTER_URL': os.getenv('PDF_CONVERTER_URL', ''),
        'PORT': os.getenv('PORT', '8001'),
    }
    return safe_vars

@app.put("/api/env-variables")
def update_env_variables(env_vars: dict = Body(...)):
    """Update environment variables (writes to .env file)"""
    try:
        env_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
        
        # Read existing .env file
        existing_vars = {}
        if os.path.exists(env_file_path):
            with open(env_file_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        existing_vars[key.strip()] = value.strip()
        
        # Update with new values
        existing_vars.update(env_vars)
        
        # Write back to .env file
        with open(env_file_path, 'w') as f:
            for key, value in existing_vars.items():
                f.write(f"{key}={value}\n")
        
        return {"success": True, "message": "Environment variables updated. Server restart may be required."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating environment variables: {str(e)}")

# ==================== AI INSTRUCTIONS ====================
@app.get("/api/ai-instructions")
def get_ai_instructions():
    """Get AI chat instructions"""
    # Try to get from database first
    instructions_doc = db['ai_instructions'].find_one({})
    if instructions_doc and 'instructions' in instructions_doc:
        return {"instructions": instructions_doc['instructions']}
    
    # Return default instructions if not found
    default_instructions = """You are Ibrahim El Khalil's AI assistant, helping visitors learn about his portfolio and capabilities.

Key Guidelines:
- Be professional, friendly, and helpful
- Provide accurate information about Ibrahim's experience, skills, and projects
- Guide users to relevant sections of the portfolio
- Answer questions about his work, education, and achievements
- If you don't know something, be honest and suggest contacting Ibrahim directly

Remember to maintain a conversational tone while being informative and respectful."""
    
    return {"instructions": default_instructions}

@app.put("/api/ai-instructions")
def update_ai_instructions(data: dict = Body(...)):
    """Update AI chat instructions"""
    try:
        instructions = data.get('instructions', '')
        
        # Upsert to database
        db['ai_instructions'].update_one(
            {},
            {"$set": {"instructions": instructions}},
            upsert=True
        )
        
        return {"success": True, "message": "AI instructions updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating AI instructions: {str(e)}")

# ==================== THEME ====================
@app.get("/api/theme")
def get_theme():
    """Get theme colors"""
    theme_doc = db['theme'].find_one({})
    if theme_doc:
        return {
            "primary_color": theme_doc.get('primary_color', '#ef4444'),
            "secondary_color": theme_doc.get('secondary_color', '#dc2626'),
            "accent_color": theme_doc.get('accent_color', '#991b1b'),
            "background_color": theme_doc.get('background_color', '#000000'),
            "surface_color": theme_doc.get('surface_color', '#111827'),
            "text_color": theme_doc.get('text_color', '#ffffff'),
            "muted_text_color": theme_doc.get('muted_text_color', '#9ca3af'),
            "header_color": theme_doc.get('header_color', theme_doc.get('primary_color', '#ef4444')),
            "border_radius": theme_doc.get('border_radius', '0.75rem'),
            "shadow_intensity": theme_doc.get('shadow_intensity', 'medium'),
            "animation_speed": theme_doc.get('animation_speed', 'normal'),
            "font_size": theme_doc.get('font_size', 'medium'),
            "spacing": theme_doc.get('spacing', 'normal'),
            "gradient_style": theme_doc.get('gradient_style', 'linear')
        }
    
    # Return default theme
    return {
        "primary_color": "#ef4444",
        "secondary_color": "#dc2626",
        "accent_color": "#991b1b",
        "background_color": "#000000",
        "surface_color": "#111827",
        "text_color": "#ffffff",
        "muted_text_color": "#9ca3af",
        "header_color": "#ef4444",
        "border_radius": "0.75rem",
        "shadow_intensity": "medium",
        "animation_speed": "normal",
        "font_size": "medium",
        "spacing": "normal",
        "gradient_style": "linear"
    }

@app.post("/api/theme")
def update_theme(data: dict = Body(...)):
    """Update theme colors"""
    try:
        theme_data = {
            "primary_color": data.get('primary_color', '#ef4444'),
            "secondary_color": data.get('secondary_color', '#dc2626'),
            "accent_color": data.get('accent_color', '#991b1b'),
            "background_color": data.get('background_color', '#000000'),
            "surface_color": data.get('surface_color', '#111827'),
            "text_color": data.get('text_color', '#ffffff'),
            "muted_text_color": data.get('muted_text_color', '#9ca3af'),
            "header_color": data.get('header_color', data.get('primary_color', '#ef4444')),
            "border_radius": data.get('border_radius', '0.75rem'),
            "shadow_intensity": data.get('shadow_intensity', 'medium'),
            "animation_speed": data.get('animation_speed', 'normal'),
            "font_size": data.get('font_size', 'medium'),
            "spacing": data.get('spacing', 'normal'),
            "gradient_style": data.get('gradient_style', 'linear')
        }
        
        # Upsert to database
        db['theme'].update_one(
            {},
            {"$set": theme_data},
            upsert=True
        )
        
        return {"success": True, "message": "Theme updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating theme: {str(e)}")

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


# ==================== RESUME GENERATION ====================
@app.post("/api/generate_resume")
def generate_resume():
    """Generate a simple PDF resume from stored profile data and return it."""
    try:
        # Gather data (use fallback data when MongoDB is down)
        def safe_find_one(coll):
            try:
                return coll.find_one({}) or {}
            except Exception:
                return {}

        def safe_find_list(coll):
            try:
                return list(coll.find({}))
            except Exception:
                return []

        # Try MongoDB first, fall back to sample data if unreachable
        profile = safe_find_one(profile_collection)
        experiences = safe_find_list(experience_collection)
        education = safe_find_list(education_collection)
        skills = safe_find_list(skills_collection)
        ventures = safe_find_list(ventures_collection)

        # Use sample data if MongoDB returned empty results
        if not profile and not experiences and not education:
            profile = {
                "name": "Ibrahim El Khalil",
                "title": "AI & Full Stack Developer",
                "summary": "Experienced AI Developer and Full Stack Engineer specializing in machine learning, web development, and cloud solutions. Strong background in developing scalable applications and implementing AI-driven features."
            }
            experiences = [
                {
                    "title": "Senior AI Developer",
                    "company": "Tech Solutions Inc.",
                    "startDate": "2023",
                    "endDate": "Present",
                    "description": "Led AI initiatives and developed machine learning solutions for enterprise clients. Implemented natural language processing systems and computer vision applications."
                },
                {
                    "title": "Full Stack Developer",
                    "company": "Digital Innovations Ltd",
                    "startDate": "2021",
                    "endDate": "2023",
                    "description": "Developed and maintained scalable web applications using React, Node.js, and Python. Implemented microservices architecture and RESTful APIs."
                }
            ]
            education = [
                {
                    "degree": "Master of Science in Computer Science",
                    "institution": "Tech University",
                    "startDate": "2019",
                    "endDate": "2021"
                },
                {
                    "degree": "Bachelor of Science in Software Engineering",
                    "institution": "Engineering Institute",
                    "startDate": "2015",
                    "endDate": "2019"
                }
            ]
            skills = [
                {
                    "category": "Programming Languages",
                    "items": ["Python", "JavaScript", "TypeScript", "Java", "C++"]
                },
                {
                    "category": "Web Technologies",
                    "items": ["React", "Node.js", "Express", "FastAPI", "GraphQL"]
                },
                {
                    "category": "AI & ML",
                    "items": ["TensorFlow", "PyTorch", "Scikit-learn", "NLP", "Computer Vision"]
                }
            ]
            ventures = [
                {
                    "name": "AI Solutions Hub",
                    "role": "Founder & Lead Developer"
                },
                {
                    "name": "Tech Education Initiative",
                    "role": "Technical Advisor"
                }
            ]

        # If ReportLab is available and configured, produce a PDF
        if HAS_REPORTLAB:
            buffer = io.BytesIO()
            c = canvas.Canvas(buffer, pagesize=A4)
            width, height = A4
            y = height - 50

            # Add a subtle red line at the top
            c.setStrokeColorRGB(0.72, 0.11, 0.11)  # Red color
            c.setLineWidth(3)
            c.line(40, y + 5, width - 40, y + 5)
            y -= 10

            # Header with enhanced styling
            c.setFillColorRGB(0.72, 0.11, 0.11)  # Red color for name
            c.setFont("Helvetica-Bold", 22)
            c.drawString(40, y, profile.get('name', ''))
            y -= 26
            c.setFillColorRGB(0.2, 0.2, 0.2)  # Dark gray for title
            c.setFont("Helvetica-Oblique", 13)
            c.drawString(40, y, profile.get('title', ''))
            y -= 20

            # Reset to black for body text
            c.setFillColorRGB(0, 0, 0)

            # Summary (if present) - condensed
            summary = profile.get('summary') or profile.get('about') or ''
            if summary:
                # Ensure summary is a string
                summary_text = str(summary) if not isinstance(summary, str) else summary
                c.setFont("Helvetica", 10)
                for line in textwrap.wrap(summary_text, 95):
                    if y < 80:
                        c.showPage()
                        y = height - 50
                    c.drawString(40, y, line)
                    y -= 12
                y -= 6

            # Experience with improved styling
            if experiences:
                # Section header with red accent
                c.setFillColorRGB(0.72, 0.11, 0.11)
                c.setFont("Helvetica-Bold", 14)
                if y < 80:
                    c.showPage()
                    y = height - 50
                c.drawString(40, y, "Experience")
                c.setStrokeColorRGB(0.72, 0.11, 0.11)
                c.setLineWidth(1)
                c.line(40, y - 3, 140, y - 3)
                c.setFillColorRGB(0, 0, 0)
                y -= 18
                
                for exp in experiences:
                    if y < 100:
                        c.showPage()
                        y = height - 50
                    # Title and Company
                    role = exp.get('role') or exp.get('title', '')
                    company = exp.get('company', '')
                    title = f"{role} @ {company}"
                    c.setFont("Helvetica-Bold", 11)
                    c.drawString(40, y, title)
                    y -= 14
                    # Date range - use 'period' field or construct from startDate/endDate
                    c.setFont("Helvetica", 9)
                    c.setFillColorRGB(0.3, 0.3, 0.3)
                    period = exp.get('period') or f"{exp.get('startDate','')} - {exp.get('endDate','') or 'Present'}"
                    if period and period.strip():
                        c.drawString(40, y, period)
                        y -= 12
                    # Location if available
                    location = exp.get('location', '')
                    if location:
                        c.setFont("Helvetica-Oblique", 9)
                        c.drawString(40, y, location)
                        y -= 12
                    c.setFillColorRGB(0, 0, 0)
                    # Description - condensed spacing
                    c.setFont("Helvetica", 10)
                    desc = exp.get('description', '')
                    # Handle both string and list descriptions
                    if isinstance(desc, list):
                        for item in desc:
                            item_text = str(item) if not isinstance(item, str) else item
                            for line in textwrap.wrap(f"• {item_text}", 90):
                                if y < 60:
                                    c.showPage()
                                    y = height - 50
                                c.drawString(44, y, line)
                                y -= 11
                    else:
                        desc_text = str(desc) if not isinstance(desc, str) else desc
                        for line in textwrap.wrap(desc_text, 95):
                            if y < 60:
                                c.showPage()
                                y = height - 50
                            c.drawString(44, y, line)
                            y -= 11
                    y -= 6

            # Education with improved styling
            if education:
                # Section header with red accent
                c.setFillColorRGB(0.72, 0.11, 0.11)
                c.setFont("Helvetica-Bold", 14)
                if y < 80:
                    c.showPage()
                    y = height - 50
                c.drawString(40, y, "Education")
                c.setStrokeColorRGB(0.72, 0.11, 0.11)
                c.setLineWidth(1)
                c.line(40, y - 3, 130, y - 3)
                c.setFillColorRGB(0, 0, 0)
                y -= 18
                
                for edu in education:
                    if y < 100:
                        c.showPage()
                        y = height - 50
                    # Degree and Institution
                    degree = edu.get('degree') or edu.get('title', '')
                    institution = edu.get('institution') or edu.get('school', '')
                    c.setFont("Helvetica-Bold", 11)
                    c.drawString(40, y, degree)
                    y -= 14
                    c.setFont("Helvetica", 10)
                    c.drawString(40, y, institution)
                    y -= 12
                    # Date range
                    period = edu.get('period') or f"{edu.get('startDate','')} - {edu.get('endDate','')}"
                    if period and period.strip():
                        c.setFont("Helvetica", 9)
                        c.setFillColorRGB(0.3, 0.3, 0.3)
                        c.drawString(40, y, period)
                        y -= 12
                    # Location if available
                    location = edu.get('location', '')
                    if location:
                        c.setFont("Helvetica-Oblique", 9)
                        c.drawString(40, y, location)
                        y -= 12
                    c.setFillColorRGB(0, 0, 0)
                    # Description or field of study - condensed
                    desc = edu.get('description') or edu.get('field', '')
                    if desc:
                        c.setFont("Helvetica", 9)
                        desc_text = str(desc) if not isinstance(desc, str) else desc
                        for line in textwrap.wrap(desc_text, 95):
                            if y < 60:
                                c.showPage()
                                y = height - 50
                            c.drawString(44, y, line)
                            y -= 10
                    y -= 6

            # Skills section removed to save space and fit on one page

            c.save()
            buffer.seek(0)

            return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=resume.pdf"})

        # Build HTML resume
        html_parts = []
        html_parts.append('<!doctype html><html><head><meta charset="utf-8"><title>Resume</title>')
        html_parts.append('<style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111;line-height:1.4} h1{color:#2563eb;font-size:28px;margin-bottom:5px} h2{color:#1f2937;font-size:18px;margin-top:20px;margin-bottom:10px;border-bottom:2px solid #e5e7eb;padding-bottom:5px} .section{margin-top:18px} .muted{color:#6b7280;font-size:14px} .contact{color:#374151;margin-bottom:15px} .experience-item,.education-item{margin-bottom:15px} .skills-grid{display:flex;flex-wrap:wrap;gap:8px} .skill-tag{background-color:#f3f4f6;padding:4px 8px;border-radius:4px;font-size:12px;color:#374151}</style>')
        html_parts.append('</head><body>')
        html_parts.append(f"<h1>{profile.get('name','')}</h1>")
        html_parts.append(f"<div class=\"muted\">{profile.get('title','')}</div>")
        if profile.get('summary'):
            html_parts.append(f"<div class='section'><strong>Summary</strong><p>{profile.get('summary')}</p></div>")

        if experiences:
            html_parts.append("<div class='section'><strong>Experience</strong>")
            for exp in experiences:
                html_parts.append(f"<div><strong>{exp.get('title','')} @ {exp.get('company','')}</strong><div class='muted'>{exp.get('startDate','')} - {exp.get('endDate','') or 'Present'}</div><p>{exp.get('description','')}</p></div>")
            html_parts.append("</div>")

        if education:
            html_parts.append("<div class='section'><strong>Education</strong>")
            for edu in education:
                html_parts.append(f"<div><strong>{edu.get('degree','')} - {edu.get('institution','')}</strong><div class='muted'>{edu.get('startDate','')} - {edu.get('endDate','')}</div></div>")
            html_parts.append("</div>")

        if skills:
            flat_skills = []
            for s in skills:
                items = s.get('items') if isinstance(s, dict) else s
                if isinstance(items, list):
                    flat_skills.extend(items)
                elif isinstance(s, list):
                    flat_skills.extend(s)
            html_parts.append("<div class='section'><strong>Skills</strong><p>" + ', '.join(flat_skills[:200]) + "</p></div>")

        if ventures:
            html_parts.append("<div class='section'><strong>Ventures</strong>")
            for v in ventures:
                html_parts.append(f"<div><strong>{v.get('name','')}</strong> - {v.get('role','')}</div>")
            html_parts.append("</div>")

        html_parts.append('</body></html>')
        html = '\n'.join(html_parts)

        # If a PDF converter service is configured, forward HTML to it to produce a PDF
        pdf_converter_url = os.getenv('PDF_CONVERTER_URL')
        if pdf_converter_url:
            try:
                # import requests lazily so server can start even if requests isn't installed
                import requests
                conv_endpoint = pdf_converter_url.rstrip('/') + '/pdf'
                # send HTML to converter and stream back PDF
                r = requests.post(conv_endpoint, json={'html': html}, stream=True, timeout=60)
                if r.status_code == 200:
                    headers = {
                        'Content-Type': r.headers.get('Content-Type', 'application/pdf'),
                        'Content-Disposition': r.headers.get('Content-Disposition', 'attachment; filename=resume.pdf')
                    }
                    return StreamingResponse(r.raw, status_code=200, headers=headers)
                else:
                    # fall back to returning HTML if converter failed
                    return StreamingResponse(io.BytesIO(html.encode('utf-8')), media_type='text/html', headers={"Content-Disposition": "attachment; filename=resume.html"})
            except Exception as e:
                # log and fall back to HTML
                print('PDF converter call failed:', e)
                return StreamingResponse(io.BytesIO(html.encode('utf-8')), media_type='text/html', headers={"Content-Disposition": "attachment; filename=resume.html"})

        # Default fallback: return HTML for browsers to print
        return StreamingResponse(io.BytesIO(html.encode('utf-8')), media_type='text/html', headers={"Content-Disposition": "attachment; filename=resume.html"})
    except RuntimeError as re:
        # Informative error when build-time deps are missing
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume generation failed: {str(e)}")

# ==================== AI-ENHANCED ATS RESUME GENERATION ====================
@app.post("/api/generate_ats_resume")
async def generate_ats_resume(request: dict):
    """Generate an ATS-friendly resume using AI to optimize content and structure."""
    try:
        # Get job description from request (optional)
        job_description = request.get('job_description', '')
        target_role = request.get('target_role', 'Software Engineer')
        
        # Import Gemini API
        import google.generativeai as genai
        
        # Configure Gemini
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise HTTPException(status_code=503, detail="Gemini API key not configured")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Gather data from database
        def safe_find_one(coll):
            try:
                return coll.find_one({}) or {}
            except Exception:
                return {}

        def safe_find_list(coll):
            try:
                return list(coll.find({}))
            except Exception:
                return []

        profile = safe_find_one(profile_collection)
        experiences = safe_find_list(experience_collection)
        education = safe_find_list(education_collection)
        skills = safe_find_list(skills_collection)
        ventures = safe_find_list(ventures_collection)

        # Prepare data for AI analysis
        profile_data = {
            "profile": profile,
            "experiences": experiences,
            "education": education,
            "skills": skills,
            "ventures": ventures
        }

        # Create AI prompt for ATS optimization
        ai_prompt = f"""
You are an expert resume writer and ATS (Applicant Tracking System) specialist. 
Create an ATS-friendly, professionally optimized resume based on the provided data.

TARGET ROLE: {target_role}
JOB DESCRIPTION: {job_description if job_description else 'General software engineering position'}

CANDIDATE DATA:
{str(profile_data)}

REQUIREMENTS:
1. Create an ATS-friendly format with clear sections
2. Use standard section headers (Summary, Experience, Education, Skills)
3. Include relevant keywords from the job description
4. Prioritize most relevant experience and skills
5. Use action verbs and quantifiable achievements
6. Keep descriptions concise but impactful
7. Ensure proper formatting for ATS parsing
8. Optimize content for the target role

OUTPUT FORMAT:
Return a JSON object with the following structure:
{{
    "name": "Full Name",
    "title": "Professional Title",
    "contact": {{
        "email": "email",
        "phone": "phone",
        "location": "location",
        "linkedin": "linkedin_url",
        "github": "github_url"
    }},
    "summary": "Professional summary optimized for ATS (2-3 sentences)",
    "experience": [
        {{
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start Date - End Date",
            "achievements": [
                "Achievement 1 with metrics",
                "Achievement 2 with metrics"
            ]
        }}
    ],
    "education": [
        {{
            "degree": "Degree Name",
            "institution": "Institution Name",
            "year": "Graduation Year"
        }}
    ],
    "skills": {{
        "technical": ["skill1", "skill2"],
        "languages": ["language1", "language2"],
        "tools": ["tool1", "tool2"]
    }},
    "keywords": ["relevant", "ats", "keywords"]
}}

Focus on relevance, impact, and ATS compatibility. Remove unnecessary information and highlight the most valuable content.
"""

        # Get AI response
        response = model.generate_content(ai_prompt)
        
        # Parse AI response
        import json
        import re
        
        # Extract JSON from response
        response_text = response.text
        # Find JSON content between ```json and ``` or direct JSON
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find JSON object directly
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
            else:
                raise Exception("Could not extract valid JSON from AI response")
        
        try:
            resume_data = json.loads(json_str)
        except json.JSONDecodeError as e:
            raise Exception(f"Invalid JSON from AI: {str(e)}")

        # Generate HTML resume with ATS-friendly styling
        html_parts = []
        html_parts.append('<!doctype html><html><head><meta charset="utf-8"><title>ATS Resume</title>')
        
        # ATS-friendly CSS
        ats_css = """
        <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11pt;
            line-height: 1.3;
            color: #000;
            margin: 0.5in;
            max-width: 8.5in;
        }
        h1 {
            font-size: 16pt;
            font-weight: bold;
            color: #000;
            margin: 0 0 5pt 0;
            text-align: center;
        }
        h2 {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin: 15pt 0 5pt 0;
            border-bottom: 1pt solid #000;
            padding-bottom: 2pt;
            text-transform: uppercase;
        }
        .contact {
            text-align: center;
            margin-bottom: 15pt;
            font-size: 10pt;
        }
        .section {
            margin-bottom: 15pt;
        }
        .job-title {
            font-weight: bold;
            font-size: 11pt;
        }
        .company {
            font-weight: bold;
        }
        .duration {
            float: right;
            font-weight: normal;
        }
        .achievement {
            margin: 3pt 0;
        }
        .skills-section {
            display: block;
        }
        .skill-category {
            margin: 5pt 0;
        }
        .skill-category strong {
            font-weight: bold;
        }
        ul {
            margin: 3pt 0;
            padding-left: 15pt;
        }
        li {
            margin: 2pt 0;
        }
        </style>
        """
        
        html_parts.append(ats_css)
        html_parts.append('</head><body>')
        
        # Header
        html_parts.append(f'<h1>{resume_data.get("name", "")}</h1>')
        
        # Contact Info
        contact = resume_data.get("contact", {})
        contact_parts = []
        if contact.get("email"):
            contact_parts.append(contact["email"])
        if contact.get("phone"):
            contact_parts.append(contact["phone"])
        if contact.get("location"):
            contact_parts.append(contact["location"])
        if contact.get("linkedin"):
            contact_parts.append(contact["linkedin"])
        if contact.get("github"):
            contact_parts.append(contact["github"])
        
        if contact_parts:
            html_parts.append(f'<div class="contact">{" | ".join(contact_parts)}</div>')
        
        # Professional Title
        if resume_data.get("title"):
            html_parts.append(f'<div style="text-align: center; font-weight: bold; margin-bottom: 10pt;">{resume_data["title"]}</div>')
        
        # Summary
        if resume_data.get("summary"):
            html_parts.append('<h2>Professional Summary</h2>')
            html_parts.append(f'<div class="section">{resume_data["summary"]}</div>')
        
        # Experience
        if resume_data.get("experience"):
            html_parts.append('<h2>Professional Experience</h2>')
            html_parts.append('<div class="section">')
            for exp in resume_data["experience"]:
                html_parts.append(f'<div style="margin-bottom: 12pt;">')
                html_parts.append(f'<div class="job-title">{exp.get("title", "")} <span class="duration">{exp.get("duration", "")}</span></div>')
                html_parts.append(f'<div class="company">{exp.get("company", "")}</div>')
                if exp.get("achievements"):
                    html_parts.append('<ul>')
                    for achievement in exp["achievements"]:
                        html_parts.append(f'<li>{achievement}</li>')
                    html_parts.append('</ul>')
                html_parts.append('</div>')
            html_parts.append('</div>')
        
        # Education
        if resume_data.get("education"):
            html_parts.append('<h2>Education</h2>')
            html_parts.append('<div class="section">')
            for edu in resume_data["education"]:
                html_parts.append(f'<div style="margin-bottom: 8pt;">')
                html_parts.append(f'<div class="job-title">{edu.get("degree", "")} <span class="duration">{edu.get("year", "")}</span></div>')
                html_parts.append(f'<div>{edu.get("institution", "")}</div>')
                html_parts.append('</div>')
            html_parts.append('</div>')
        
        # Skills
        if resume_data.get("skills"):
            html_parts.append('<h2>Technical Skills</h2>')
            html_parts.append('<div class="section skills-section">')
            skills = resume_data["skills"]
            
            for category, skill_list in skills.items():
                if skill_list:
                    category_name = category.replace("_", " ").title()
                    html_parts.append(f'<div class="skill-category"><strong>{category_name}:</strong> {", ".join(skill_list)}</div>')
            
            html_parts.append('</div>')
        
        html_parts.append('</body></html>')
        html = '\n'.join(html_parts)
        
        # Return the enhanced resume
        if request.get('format') == 'json':
            return {
                "status": "success",
                "resume_data": resume_data,
                "html": html
            }
        
        # Return as HTML/PDF
        pdf_converter_url = os.getenv('PDF_CONVERTER_URL')
        if pdf_converter_url:
            try:
                import requests
                conv_endpoint = pdf_converter_url.rstrip('/') + '/pdf'
                r = requests.post(conv_endpoint, json={'html': html}, stream=True, timeout=60)
                if r.status_code == 200:
                    headers = {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename=ats_resume.pdf'
                    }
                    return StreamingResponse(r.raw, status_code=200, headers=headers)
            except Exception as e:
                print('PDF converter call failed:', e)
        
        # Return HTML
        return StreamingResponse(
            io.BytesIO(html.encode('utf-8')), 
            media_type='text/html', 
            headers={"Content-Disposition": "attachment; filename=ats_resume.html"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI resume generation failed: {str(e)}")

# ==================== PDF RESUME IMPORT ====================
@app.post("/api/import-resume")
async def import_resume(file: UploadFile = File(...)):
    """Import a PDF resume and populate database from extracted data"""
    if not HAS_PDF_PARSER:
        raise HTTPException(
            status_code=503, 
            detail="PDF parsing library (PyPDF2) is not available. Please install it first."
        )
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Read PDF content
        content = await file.read()
        pdf_reader = PdfReader(io.BytesIO(content))
        
        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Parse the resume text
        parsed_data = parse_resume_text(text)
        
        # Populate database
        populate_database_from_parsed_resume(parsed_data)
        
        return {
            "success": True,
            "message": "Resume imported successfully",
            "data": parsed_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error importing resume: {str(e)}")

def parse_resume_text(text: str) -> dict:
    """Parse resume text and extract structured data"""
    lines = text.split('\n')
    parsed = {
        'profile': {},
        'experience': [],
        'education': [],
        'skills': []
    }
    
    # Simple parsing logic - can be enhanced based on resume format
    current_section = None
    current_item = {}
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Detect sections
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in ['experience', 'work history', 'employment']):
            if current_item and current_section == 'experience':
                parsed['experience'].append(current_item)
            current_section = 'experience'
            current_item = {}
            continue
        elif any(keyword in line_lower for keyword in ['education', 'academic', 'qualification']):
            if current_item and current_section == 'experience':
                parsed['experience'].append(current_item)
            current_section = 'education'
            current_item = {}
            continue
        elif any(keyword in line_lower for keyword in ['skills', 'technical skills', 'competencies']):
            if current_item:
                if current_section == 'experience':
                    parsed['experience'].append(current_item)
                elif current_section == 'education':
                    parsed['education'].append(current_item)
            current_section = 'skills'
            current_item = {}
            continue
        
        # Parse profile information (usually at the top)
        if current_section is None:
            if 'name' not in parsed['profile'] and len(line.split()) <= 4 and line[0].isupper():
                parsed['profile']['name'] = line
            elif '@' in line and 'email' not in parsed['profile']:
                parsed['profile']['email'] = line
            elif any(word in line_lower for word in ['developer', 'engineer', 'designer', 'manager', 'specialist']):
                if 'title' not in parsed['profile']:
                    parsed['profile']['title'] = line
        
        # Parse experience entries
        elif current_section == 'experience':
            # Date patterns like "2020 - 2023" or "Jan 2020 - Dec 2023"
            date_pattern = r'(\d{4}|\w+\s+\d{4})\s*[-–]\s*(\d{4}|\w+\s+\d{4}|present|current)'
            date_match = re.search(date_pattern, line, re.IGNORECASE)
            
            if date_match:
                if current_item:
                    parsed['experience'].append(current_item)
                current_item = {'period': date_match.group(0)}
            elif 'role' not in current_item and len(line.split()) <= 8:
                current_item['role'] = line
            elif 'company' not in current_item and 'role' in current_item:
                current_item['company'] = line
            elif 'role' in current_item:
                if 'description' not in current_item:
                    current_item['description'] = []
                # Remove bullet points
                clean_line = re.sub(r'^[•\-\*]\s*', '', line)
                if clean_line:
                    current_item['description'].append(clean_line)
        
        # Parse education entries
        elif current_section == 'education':
            date_pattern = r'(\d{4}|\w+\s+\d{4})\s*[-–]\s*(\d{4}|\w+\s+\d{4})'
            date_match = re.search(date_pattern, line, re.IGNORECASE)
            
            if date_match:
                if current_item:
                    parsed['education'].append(current_item)
                current_item = {'period': date_match.group(0)}
            elif any(word in line_lower for word in ['bachelor', 'master', 'phd', 'diploma', 'degree']):
                current_item['degree'] = line
            elif 'degree' in current_item and 'institution' not in current_item:
                current_item['institution'] = line
        
        # Parse skills
        elif current_section == 'skills':
            # Skills are often comma-separated or bulleted
            if ',' in line:
                skills_list = [s.strip() for s in line.split(',')]
                for skill in skills_list:
                    if skill:
                        parsed['skills'].append({'name': skill, 'level': 70})
            else:
                clean_skill = re.sub(r'^[•\-\*]\s*', '', line)
                if clean_skill:
                    parsed['skills'].append({'name': clean_skill, 'level': 70})
    
    # Don't forget the last item
    if current_item:
        if current_section == 'experience':
            parsed['experience'].append(current_item)
        elif current_section == 'education':
            parsed['education'].append(current_item)
    
    return parsed

def populate_database_from_parsed_resume(data: dict):
    """Populate database collections from parsed resume data"""
    
    # Update profile
    if data['profile']:
        profile_collection.update_one(
            {},
            {"$set": data['profile']},
            upsert=True
        )
    
    # Add experience entries
    for exp in data['experience']:
        if 'role' in exp or 'company' in exp:
            exp['id'] = generate_id()
            # Set defaults for missing fields
            exp.setdefault('role', 'Role not specified')
            exp.setdefault('company', 'Company not specified')
            exp.setdefault('location', '')
            exp.setdefault('period', '')
            exp.setdefault('description', [])
            experience_collection.insert_one(exp)
    
    # Add education entries
    for edu in data['education']:
        if 'degree' in edu or 'institution' in edu:
            edu['id'] = generate_id()
            # Set defaults for missing fields
            edu.setdefault('degree', 'Degree not specified')
            edu.setdefault('institution', 'Institution not specified')
            edu.setdefault('location', '')
            edu.setdefault('period', '')
            edu.setdefault('field', '')
            education_collection.insert_one(edu)
    
    # Add skills
    if data['skills']:
        # Group skills into a general category
        skill_category = {
            'id': generate_id(),
            'category': 'General Skills',
            'skills': data['skills']
        }
        skills_collection.insert_one(skill_category)

# ==================== AI CHAT WITH MEMORY ====================
@app.post("/api/ai/chat")
async def ai_chat(data: dict = Body(...)):
    """
    AI Chat endpoint with Mem0 memory integration
    Provides personalized responses based on conversation history
    """
    try:
        message = data.get("message", "")
        user_id = data.get("user_id", "anonymous")
        session_id = data.get("session_id", str(uuid.uuid4()))
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get Mem0 service
        mem0_service = get_mem0_service()
        
        # Get AI instructions from database
        instructions_doc = db['ai_instructions'].find_one({})
        system_instruction = instructions_doc.get('instructions') if instructions_doc else None
        
        if not system_instruction:
            system_instruction = """You are Ibrahim El Khalil's AI assistant. You help visitors learn about his portfolio, skills, and experience.
            
Be professional, friendly, and helpful. Provide accurate information about Ibrahim's:
- Professional experience and projects
- Technical skills and expertise
- Education and achievements
- Ventures and entrepreneurial activities

If you remember previous conversations with the user, use that context to provide personalized responses."""
        
        # Get relevant context from memories
        memory_context = ""
        if mem0_service.is_available():
            memory_context = mem0_service.get_context_for_chat(message, user_id, limit=3)
        
        # Import Gemini
        try:
            import google.generativeai as genai
            api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            
            if not api_key or api_key == "your-gemini-api-key-here":
                return {
                    "response": "I'm currently in demo mode. Please configure the Gemini API key to enable AI chat functionality.",
                    "has_memory": False
                }
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Build the prompt with memory context
            full_prompt = system_instruction
            if memory_context:
                full_prompt += f"\n\n{memory_context}\n\nUser's current question: {message}"
            else:
                full_prompt += f"\n\nUser's question: {message}"
            
            # Generate response
            response = model.generate_content(full_prompt)
            ai_response = response.text
            
            # Store conversation in memory
            if mem0_service.is_available():
                conversation = [
                    {"role": "user", "content": message},
                    {"role": "assistant", "content": ai_response}
                ]
                mem0_service.add_conversation(
                    conversation,
                    user_id=user_id,
                    metadata={
                        "session_id": session_id,
                        "timestamp": datetime.utcnow().isoformat()
                    }
                )
            
            # Track analytics
            analytics_collection.update_one(
                {},
                {"$inc": {"ai_chat_sessions": 1}},
                upsert=True
            )
            
            return {
                "response": ai_response,
                "has_memory": mem0_service.is_available(),
                "session_id": session_id
            }
            
        except Exception as e:
            logger.error(f"Error in AI chat: {e}")
            raise HTTPException(status_code=500, detail=f"AI chat error: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in AI chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MEMORY MANAGEMENT ====================
@app.get("/api/memories")
async def get_memories(user_id: str = "anonymous", limit: Optional[int] = None):
    """Get all memories for a user"""
    try:
        mem0_service = get_mem0_service()
        
        if not mem0_service.is_available():
            return {
                "success": False,
                "message": "Memory service not available",
                "memories": []
            }
        
        if limit:
            # Search with limit
            memories = mem0_service.search_memories("", user_id, limit)
        else:
            # Get all memories
            memories = mem0_service.get_all_memories(user_id)
        
        return {
            "success": True,
            "memories": memories,
            "count": len(memories)
        }
        
    except Exception as e:
        logger.error(f"Error getting memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories/search")
async def search_memories(data: dict = Body(...)):
    """Search memories by query"""
    try:
        query = data.get("query", "")
        user_id = data.get("user_id", "anonymous")
        limit = data.get("limit", 5)
        
        mem0_service = get_mem0_service()
        
        if not mem0_service.is_available():
            return {
                "success": False,
                "message": "Memory service not available",
                "results": []
            }
        
        results = mem0_service.search_memories(query, user_id, limit)
        
        return {
            "success": True,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error(f"Error searching memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: str):
    """Delete a specific memory"""
    try:
        mem0_service = get_mem0_service()
        
        if not mem0_service.is_available():
            raise HTTPException(status_code=503, detail="Memory service not available")
        
        success = mem0_service.delete_memory(memory_id)
        
        if success:
            return {"success": True, "message": "Memory deleted"}
        else:
            raise HTTPException(status_code=404, detail="Memory not found or could not be deleted")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting memory: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/user/{user_id}")
async def delete_all_user_memories(user_id: str):
    """Delete all memories for a user"""
    try:
        mem0_service = get_mem0_service()
        
        if not mem0_service.is_available():
            raise HTTPException(status_code=503, detail="Memory service not available")
        
        success = mem0_service.delete_all_memories(user_id)
        
        if success:
            return {"success": True, "message": f"All memories deleted for user {user_id}"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete memories")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting user memories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memories/status")
async def get_memory_status():
    """Check if memory service is available and get stats"""
    try:
        mem0_service = get_mem0_service()
        
        return {
            "available": mem0_service.is_available(),
            "provider": "Mem0 with Gemini 2.0 Flash" if mem0_service.is_available() else None,
            "vector_store": "ChromaDB" if mem0_service.is_available() else None
        }
        
    except Exception as e:
        logger.error(f"Error getting memory status: {e}")
        return {
            "available": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)