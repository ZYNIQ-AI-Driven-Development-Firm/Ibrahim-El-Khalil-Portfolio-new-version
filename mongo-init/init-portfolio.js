// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the portfolio database
db = db.getSiblingDB('portfolio_db');

// Create collections with indexes for better performance
db.createCollection('profile');
db.createCollection('experience');
db.createCollection('education');
db.createCollection('skills');
db.createCollection('ventures');
db.createCollection('achievements');
db.createCollection('whitepapers');
db.createCollection('appointments');
db.createCollection('analytics');

// Create indexes
db.experience.createIndex({ "id": 1 }, { unique: true });
db.education.createIndex({ "id": 1 }, { unique: true });
db.skills.createIndex({ "id": 1 }, { unique: true });
db.ventures.createIndex({ "id": 1 }, { unique: true });
db.whitepapers.createIndex({ "id": 1 }, { unique: true });
db.appointments.createIndex({ "id": 1 }, { unique: true });
db.appointments.createIndex({ "date": 1 });
db.appointments.createIndex({ "status": 1 });

// Initialize analytics collection
db.analytics.insertOne({
    total_visits: 0,
    unique_visitors: 0,
    ai_chat_sessions: 0,
    appointments_booked: 0,
    skills_viewed: 0,
    last_updated: new Date().toISOString()
});

print('Portfolio database initialized successfully!');