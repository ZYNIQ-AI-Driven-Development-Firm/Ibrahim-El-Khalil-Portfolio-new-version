# PowerShell Migration Script
$apiUrl = "http://localhost:8001/api/migrate"

$migrationData = @{
    profile = @{
        name = "Ibrahim El Khalil"
        title = "Entrepreneur | Senior Software Engineer | AI Architect"
        location = "Dubai, UAE"
        summary = "Seasoned Software Engineer and Entrepreneur with 7+ years of expertise in designing and implementing scalable, high-performance backend solutions and AI systems. Passionate about building robust, secure, and efficient systems that drive business success and innovation."
        image = "https://media.licdn.com/dms/image/v2/D4D03AQHzrNujzyMu-A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1717665068304?e=1738800000&v=beta&t=pZE4LCWYcUqoHG3_CtfsFQOKLUGiAMLiWOCkRaT9s-I"
        linkedin = "https://linkedin.com/in/ibrahimelgibran"
        github = "https://github.com/ibrahimelgibran"
        email = "contact@khalilpreview.space"
    }
    experience = @(
        @{
            role = "Co-Founder & Technical Architect"
            company = "ZYNIQ"
            period = "Jul 2022 - Present"
            location = "Dubai, UAE"
            description = @(
                "Co-founded ZYNIQ to revolutionize software development with AI-driven solutions and multi-agent systems.",
                "Designed scalable architectures for intelligent agent coordination and autonomous task execution.",
                "Led end-to-end development of flagship products, including AI-powered coding assistants and workflow automation tools.",
                "Built robust backend systems capable of handling complex, multi-layered agent interactions.",
                "Integrated cutting-edge AI models (GPT-4, Claude, Gemini) to enhance agent decision-making and productivity."
            )
        },
        @{
            role = "Senior Software Engineer (Backend)"
            company = "Kaoun International"
            period = "Jun 2022 - Present"
            location = "Dubai, UAE"
            description = @(
                "Architected and developed scalable, high-performance backend systems using Python, Django, and FastAPI.",
                "Designed and implemented RESTful APIs serving millions of requests with optimized response times.",
                "Built real-time data processing pipelines for analytics and monitoring using Celery, Redis, and Kafka.",
                "Led database optimization efforts, improving query performance by 40% through indexing and schema redesign.",
                "Mentored junior engineers on best practices in system design, code quality, and testing."
            )
        },
        @{
            role = "Backend Developer"
            company = "FineTech Kio"
            period = "Jun 2019 - Jun 2022"
            location = "Mostaganem, Algeria"
            description = @(
                "Developed, tested, and debugged software tools for clients and internal customers.",
                "Managed PostgreSQL and non-SQL databases (Celery, Redis, Elasticsearch) within Agile development processes."
            )
        },
        @{
            role = "Fullstack Web Developer"
            company = "Preview-Lab"
            period = "Jan 2018 - Jan 2020"
            location = "Mostaganem, Algeria"
            description = @(
                "Developed a Python-based API (RESTful Web Service) using Flask for client applications, handling over 10,000 requests per day.",
                "Maintained and optimized MongoDB and PostgreSQL databases."
            )
        }
    )
    education = @(
        @{
            institution = "INSFP de Mostaganem"
            degree = "BTS Diploma in Industrial Automation & Regulation"
            period = "2016 - 2019"
            location = "Mostaganem, Algeria"
            description = "Focused on automated systems, control engineering, and industrial processes."
        }
    )
    skills = @(
        @{
            category = "Backend Development"
            skills = @(
                @{name = "Python"; level = 95},
                @{name = "Django"; level = 90},
                @{name = "FastAPI"; level = 88},
                @{name = "Flask"; level = 85},
                @{name = "Node.js"; level = 75}
            )
        },
        @{
            category = "Databases"
            skills = @(
                @{name = "PostgreSQL"; level = 90},
                @{name = "MongoDB"; level = 85},
                @{name = "Redis"; level = 80},
                @{name = "Elasticsearch"; level = 75}
            )
        },
        @{
            category = "Cloud & DevOps"
            skills = @(
                @{name = "AWS"; level = 85},
                @{name = "Docker"; level = 90},
                @{name = "Kubernetes"; level = 75},
                @{name = "CI/CD"; level = 80}
            )
        },
        @{
            category = "AI & Machine Learning"
            skills = @(
                @{name = "LangChain"; level = 85},
                @{name = "OpenAI API"; level = 90},
                @{name = "RAG Systems"; level = 80},
                @{name = "Agent Frameworks"; level = 85}
            )
        }
    )
    ventures = @(
        @{
            name = "ZYNIQ - AI Development Platform"
            description = "Co-founded ZYNIQ to build next-generation AI-powered development tools using multi-agent systems."
            technologies = @("Python", "FastAPI", "LangChain", "OpenAI", "Docker", "React")
            achievements = @(
                "Built autonomous coding agents that understand context and generate production-ready code",
                "Developed intelligent workflow orchestration for complex software projects",
                "Created seamless integration with popular IDEs and development tools"
            )
        },
        @{
            name = "Enterprise Backend Systems"
            description = "Designed and implemented scalable backend architectures for high-traffic applications."
            technologies = @("Python", "Django", "PostgreSQL", "Redis", "Celery", "AWS")
            achievements = @(
                "Architected systems handling 10M+ daily requests",
                "Reduced API response times by 60% through optimization",
                "Implemented real-time data processing pipelines"
            )
        }
    )
    achievements = @{
        certificates = @(
            @{
                name = "AWS Certified Solutions Architect"
                year = "2023"
                issuer = "Amazon Web Services"
            },
            @{
                name = "Professional Scrum Master I (PSM I)"
                year = "2022"
                issuer = "Scrum.org"
            }
        )
        hackathons = @(
            @{
                year = "2019"
                event = "Leapfrog Hack 🥉(3rd Place)"
                description = "Largest Hackathon in Africa, 'Divona Challenge', Algiers"
            },
            @{
                year = "2018"
                event = "Hack! IT 🥈(2nd Place)"
                description = "Algiers smart city"
            },
            @{
                year = "2018"
                event = "Make OH / IO 🥇(1st Place)"
                description = "Online hackathon"
            },
            @{
                year = "2017"
                event = "Start-up Weekend 🥇(1st Place)"
                description = "Entrepreneurship and innovation event"
            },
            @{
                year = "2017"
                event = "Hack4Algeria 🥈(2nd Place)"
                description = "Sylabs Algiers"
            }
        )
    }
    whitepapers = @(
        @{
            title = "Microservices Architecture"
            briefDescription = "Comprehensive analysis of microservices design patterns and implementation strategies"
            detailedContent = @(
                "Introduction to microservices and their benefits",
                "Service decomposition strategies",
                "Inter-service communication patterns",
                "Data management in distributed systems",
                "Deployment and monitoring best practices",
                "Case studies and real-world applications"
            )
            publishedDate = "2024"
            pages = "25 pages"
            category = "Software Architecture"
        },
        @{
            title = "AI Agent Orchestration"
            briefDescription = "Framework for coordinating multiple AI agents in complex workflows"
            detailedContent = @(
                "Multi-agent system fundamentals",
                "Agent communication protocols",
                "Task distribution and coordination",
                "Error handling and recovery strategies",
                "Performance optimization techniques",
                "Integration with existing systems"
            )
            publishedDate = "2024"
            pages = "30 pages"
            category = "Artificial Intelligence"
        },
        @{
            title = "Decentralized Multi-Agent Systems"
            briefDescription = "Research on autonomous agent networks and blockchain integration"
            detailedContent = @(
                "Decentralized agent coordination mechanisms",
                "Blockchain-based consensus for agent networks",
                "Autonomous decision-making algorithms",
                "Scalable multi-agent communication protocols",
                "Smart contract integration for agent governance",
                "Real-world applications and use cases"
            )
            publishedDate = "2024"
            pages = "35 pages"
            category = "Distributed Systems"
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "🚀 Starting data migration to MongoDB..." -ForegroundColor Green
Write-Host "📡 Target API: $apiUrl" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $migrationData -ContentType "application/json"
    Write-Host "`n✅ Migration successful!" -ForegroundColor Green
    Write-Host "📊 Result:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "`n❌ Migration failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}
