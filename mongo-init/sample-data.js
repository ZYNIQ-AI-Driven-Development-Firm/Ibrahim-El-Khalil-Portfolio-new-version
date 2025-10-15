// Sample data initialization
db = db.getSiblingDB('portfolio_db');

// Profile data
db.profile.insertOne({
    name: "Ibrahim El Khalil",
    title: "AI & Full Stack Developer",
    summary: "Experienced AI Developer and Full Stack Engineer specializing in machine learning, web development, and cloud solutions. Strong background in developing scalable applications and implementing AI-driven features.",
    email: "contact@example.com",
    location: "Tech Hub City",
    links: {
        github: "https://github.com/ibrahim-el-khalil",
        linkedin: "https://linkedin.com/in/ibrahim-el-khalil"
    }
});

// Experience data
db.experience.insertMany([
    {
        id: "exp1",
        title: "Senior AI Developer",
        company: "Tech Solutions Inc.",
        location: "Silicon Valley",
        startDate: "2023",
        endDate: "Present",
        description: "Led AI initiatives and developed machine learning solutions for enterprise clients. Implemented natural language processing systems and computer vision applications."
    },
    {
        id: "exp2",
        title: "Full Stack Developer",
        company: "Digital Innovations Ltd",
        location: "Tech City",
        startDate: "2021",
        endDate: "2023",
        description: "Developed and maintained scalable web applications using React, Node.js, and Python. Implemented microservices architecture and RESTful APIs."
    }
]);

// Education data
db.education.insertMany([
    {
        id: "edu1",
        degree: "Master of Science in Computer Science",
        institution: "Tech University",
        location: "Innovation City",
        startDate: "2019",
        endDate: "2021",
        description: "Specialized in Artificial Intelligence and Machine Learning"
    },
    {
        id: "edu2",
        degree: "Bachelor of Science in Software Engineering",
        institution: "Engineering Institute",
        location: "Tech Valley",
        startDate: "2015",
        endDate: "2019",
        description: "Focus on software development and algorithms"
    }
]);

// Skills data
db.skills.insertMany([
    {
        id: "skill1",
        category: "Programming Languages",
        items: ["Python", "JavaScript", "TypeScript", "Java", "C++"]
    },
    {
        id: "skill2",
        category: "Web Technologies",
        items: ["React", "Node.js", "Express", "FastAPI", "GraphQL"]
    },
    {
        id: "skill3",
        category: "AI & ML",
        items: ["TensorFlow", "PyTorch", "Scikit-learn", "Natural Language Processing", "Computer Vision"]
    },
    {
        id: "skill4",
        category: "Cloud & DevOps",
        items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Microservices"]
    }
]);

// Ventures data
db.ventures.insertMany([
    {
        id: "vent1",
        name: "AI Solutions Hub",
        role: "Founder & Lead Developer",
        description: "Created an AI-powered platform for automated code review and optimization"
    },
    {
        id: "vent2",
        name: "Tech Education Initiative",
        role: "Technical Advisor",
        description: "Mentoring and developing curriculum for aspiring developers"
    }
]);

print('Sample data initialized successfully!');