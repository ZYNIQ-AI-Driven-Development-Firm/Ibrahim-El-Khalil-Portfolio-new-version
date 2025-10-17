from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConfigurationError
import os
from datetime import datetime
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection with better error handling
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
DATABASE_NAME = os.environ.get('DATABASE_NAME', 'portfolio_db')

client = None
db = None

try:
    # Use longer timeout for initial connection but shorter for operations
    client = MongoClient(
        MONGO_URL, 
        serverSelectionTimeoutMS=10000,  # 10 seconds for initial connection
        socketTimeoutMS=5000,            # 5 seconds for socket operations
        connectTimeoutMS=10000,          # 10 seconds for connection timeout
        maxPoolSize=10,                  # Max connection pool size
        retryWrites=True                 # Enable retryable writes
    )
    
    # Test the connection
    client.admin.command('ismaster')
    db = client[DATABASE_NAME]
    logger.info("Successfully connected to MongoDB")
    
except ServerSelectionTimeoutError as e:
    logger.error(f"MongoDB connection timeout: {e}")
    db = None
except ConfigurationError as e:
    logger.error(f"MongoDB configuration error: {e}")
    db = None
except Exception as e:
    logger.error(f"Unexpected MongoDB connection error: {e}")
    db = None

# Collections - only initialize if DB connection is successful
if db is not None:
    profile_collection = db['profile']
    experience_collection = db['experience']
    education_collection = db['education']
    skills_collection = db['skills']
    ventures_collection = db['ventures']
    achievements_collection = db['achievements']
    whitepapers_collection = db['whitepapers']
    appointments_collection = db['appointments']
    analytics_collection = db['analytics']
    blogs_collection = db['blogs']
else:
    # Create dummy collections that will raise appropriate errors
    logger.warning("MongoDB not available - collections will not work")
    profile_collection = None
    experience_collection = None
    education_collection = None
    skills_collection = None
    ventures_collection = None
    achievements_collection = None
    whitepapers_collection = None
    appointments_collection = None
    analytics_collection = None
    blogs_collection = None

def init_analytics():
    """Initialize analytics collection if it doesn't exist"""
    try:
        if db is None or analytics_collection is None:
            logger.warning("MongoDB not available - analytics initialization skipped")
            return
            
        if analytics_collection.count_documents({}) == 0:
            analytics_collection.insert_one({
                'total_visits': 0,
                'unique_visitors': 0,
                'ai_chat_sessions': 0,
                'appointments_booked': 0,
                'skills_viewed': 0,
                'last_updated': datetime.utcnow().isoformat()
            })
            logger.info("Analytics collection initialized")
    except Exception as e:
        logger.error(f"Warning: init_analytics failed: {e}")

def is_mongodb_available():
    """Check if MongoDB is available"""
    return db is not None and client is not None

# Initialize analytics only if MongoDB is available
if is_mongodb_available():
    init_analytics()
else:
    logger.warning("Skipping analytics initialization - MongoDB not available")