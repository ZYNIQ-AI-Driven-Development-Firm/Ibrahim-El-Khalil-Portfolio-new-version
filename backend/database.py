from pymongo import MongoClient
import os
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
DATABASE_NAME = os.environ.get('DATABASE_NAME', 'portfolio_db')

client = MongoClient(MONGO_URL)
db = client[DATABASE_NAME]

# Collections
profile_collection = db['profile']
experience_collection = db['experience']
education_collection = db['education']
skills_collection = db['skills']
ventures_collection = db['ventures']
achievements_collection = db['achievements']
whitepapers_collection = db['whitepapers']
appointments_collection = db['appointments']
analytics_collection = db['analytics']

def init_analytics():
    """Initialize analytics collection if it doesn't exist"""
    if analytics_collection.count_documents({}) == 0:
        analytics_collection.insert_one({
            'total_visits': 0,
            'unique_visitors': 0,
            'ai_chat_sessions': 0,
            'appointments_booked': 0,
            'skills_viewed': 0,
            'last_updated': datetime.utcnow().isoformat()
        })

init_analytics()