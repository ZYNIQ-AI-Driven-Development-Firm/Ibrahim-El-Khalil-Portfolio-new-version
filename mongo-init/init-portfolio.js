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
db.createCollection('ai_instructions');
db.createCollection('admin_settings');
db.createCollection('theme');
db.createCollection('blogs');

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

// Initialize AI instructions with default values
db.ai_instructions.insertOne({
    instructions: `You are Ibrahim El Khalil's AI assistant, helping visitors learn about his portfolio and capabilities.

Key Guidelines:
- Be professional, friendly, and helpful
- Provide accurate information about Ibrahim's experience, skills, and projects
- Guide users to relevant sections of the portfolio
- Answer questions about his work, education, and achievements
- If you don't know something, be honest and suggest contacting Ibrahim directly

Remember to maintain a conversational tone while being informative and respectful.`
});

// Initialize admin settings with default password
db.admin_settings.insertOne({
    setting: "admin_password",
    value: "pass@123"
});

// Initialize theme with default colors
db.theme.insertOne({
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#10B981"
});

print('Portfolio database initialized successfully!');