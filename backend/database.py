from pymongo import MongoClient
import os
from datetime import datetime

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
DATABASE_NAME = os.environ.get('DATABASE_NAME', 'portfolio_db')

# Use a short server selection timeout so startup doesn't hang if MongoDB is unreachable
client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
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
    try:
        if analytics_collection.count_documents({}) == 0:
            analytics_collection.insert_one({
                'total_visits': 0,
                'unique_visitors': 0,
                'ai_chat_sessions': 0,
                'appointments_booked': 0,
                'skills_viewed': 0,
                'last_updated': datetime.utcnow().isoformat()
            })
    except Exception as e:
        # If MongoDB is unreachable or requires auth, log and continue with in-memory defaults.
        print(f"Warning: init_analytics failed: {e}")

init_analytics()