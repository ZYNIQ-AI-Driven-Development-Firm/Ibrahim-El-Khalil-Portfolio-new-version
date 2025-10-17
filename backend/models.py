from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Profile(BaseModel):
    name: str
    title: str
    location: str
    summary: str
    image: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    email: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str

class Experience(BaseModel):
    id: Optional[str] = None
    role: str
    company: str
    period: str
    location: str
    description: List[str]
    projects: Optional[List[Project]] = []

class Education(BaseModel):
    id: Optional[str] = None
    degree: str
    institution: str
    period: str
    location: str
    field: str
    details: List[str]

class Skill(BaseModel):
    name: str
    level: int

class SkillCategory(BaseModel):
    id: Optional[str] = None
    category: str
    skills: List[Skill]

class Venture(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    period: str
    type: str
    description: str
    achievements: List[str]
    technologies: List[str]

class Certificate(BaseModel):
    name: str
    issuer: str
    year: str
    description: str

class Hackathon(BaseModel):
    year: str
    event: str
    description: str

class Achievements(BaseModel):
    id: Optional[str] = None
    certificates: List[Certificate]
    hackathons: List[Hackathon]

class WhitePaper(BaseModel):
    id: Optional[str] = None
    title: str
    briefDescription: str
    fullDescription: str
    keyPoints: List[str]
    publishedDate: str
    pages: str
    category: str

class Appointment(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    reason: str
    date: str
    time: str
    status: str = 'pending'
    created_at: Optional[str] = None

class BlogPost(BaseModel):
    id: Optional[str] = None
    title: str
    slug: str
    excerpt: str
    content: str
    author: str = "Ibrahim El Khalil"
    tags: List[str] = []
    category: str
    featured_image: Optional[str] = None
    images: Optional[List[str]] = []
    status: str = 'draft'  # draft, published, archived
    views: int = 0
    reading_time: Optional[int] = None  # in minutes
    published_date: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    ai_generated: bool = False