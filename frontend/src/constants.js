export const PROFILE_DATA = {
  name: 'Ibrahim El Khalil',
  title: 'Entrepreneur | Senior Software Engineer | AI Architect',
  location: 'Dubai, UAE',
  summary: 'Seasoned Software Engineer and Entrepreneur with 7+ years of expertise in designing and implementing scalable, high-performance backend solutions and AI systems. Passionate about building robust, secure, and efficient systems that drive business success and innovation.',
  image: 'https://avatars.githubusercontent.com/u/26494942?v=4',
};

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/khalilpreview/',
  github: 'https://github.com/ibrahimelgibran',
  email: 'ibrahimelkhalilpreview@gmail.com',
};

export const EXPERIENCE_DATA = [
  {
    role: 'Senior API Engineer',
    company: 'FirstGroup for Shory KSA',
    period: 'Jul 2023 - Present',
    location: 'Abu Dhabi, UAE',
    description: [
      'Led the architecture and development of the new API infrastructure for the KSA market launch.',
      'Designed and implemented scalable microservices using Python, FastAPI, and Docker.',
      'Managed cloud resources on AWS and GCP to ensure high availability and performance.',
    ],
    projects: [
      {
        name: 'KSA Market Launch Platform',
        description: 'Responsible for the entire backend platform for the new branch in KSA, ensuring seamless integration and scalability from day one.'
      }
    ]
  },
  {
    role: 'Senior Backend Developer',
    company: 'Skyloov',
    period: 'Jul 2023 - Jul 2023',
    location: 'Dubai, UAE',
    description: [
      'Developed Python-based API (RESTful Web Service) utilizing Django, Flask, SQL Alchemy, and PostgreSQL, within a Kubernetes environment.',
      'Managed and optimized 4 microservices, handling over 100,000 user requests daily.',
      'Implemented AWS services, including Dynamo DB, Lambda, and S3, to build scalable solutions.',
    ],
  },
  {
    role: 'Senior Backend Developer',
    company: 'Pixel',
    period: 'Aug 2022 - Jul 2023',
    location: 'Istanbul, Turkey',
    description: [
      'Led digital transformation for 5 real estate firms, increasing operational efficiency by 25%.',
      'Enhanced project discovery for real estate developers by developing a SaaS solution, impacting over 100 projects.',
      'Utilized Splunk for logging and observability, improving system monitoring and reducing downtime.'
    ]
  },
  {
    role: 'Lead Backend Developer',
    company: 'FineTech Kio',
    period: 'Jun 2019 - Jun 2022',
    location: 'Mostaganem, Algeria',
    description: [
      'Developed, tested, and debugged software tools for clients and internal customers.',
      'Collaborated with product managers to deliver high-quality software solutions.',
      'Led a team of 3 developers in implementing microservices architecture.'
    ]
  }
];

export const EDUCATION_DATA = [
  {
    degree: 'BTS Diploma',
    institution: 'INSFP de Mostaganem',
    period: '09/2016 - 09/2019',
    location: 'Algeria',
    field: 'Industrial Automation & Regulation',
    details: [
      'Automated Regulation and Control (ARC) offers the individual with wide knowledge and capabilities in the current distribution',
      'Installation, control programs of electro-technical automation equipment',
      'Control and regulation system of machines or industrial processes',
    ],
  },
  {
    degree: '3rd Year High School Student',
    institution: 'Ibno Rostom High School',
    period: '09/2012 - 09/2015',
    location: 'Algeria',
    field: 'Electrical and Math Engineering',
    details: [
      'Electrical engineers work on a wide range of components, devices and systems, from tiny microchips to huge power station generators',
      'Strong foundation in mathematics and electrical engineering principles',
    ],
  },
];

export const OTHER_ACHIEVEMENTS_DATA = {
  certificates: [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      year: '2023',
      description: 'Demonstrated expertise in designing distributed systems on AWS'
    },
    {
      name: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      year: '2022',
      description: 'Certified in developing scalable applications on Google Cloud Platform'
    },
    {
      name: 'Python Professional Certification',
      issuer: 'Python Institute',
      year: '2021',
      description: 'Advanced Python programming and software development practices'
    },
  ],
  hackathons: [
    {
      year: '2019',
      event: 'Mostacamp',
      description: 'National Startup Weekend, Coach and Mentor'
    },
    {
      year: '2019',
      event: 'IBDAE',
      description: 'National Startup Weekend, Coach and Mentor'
    },
    {
      year: '2018',
      event: 'Leapfrog Hack',
      description: 'Largest Hackathon in Africa, "Divona Challenge", Algiers'
    },
    {
      year: '2018',
      event: 'Hack! T',
      description: 'Algiers smart city'
    },
    {
      year: '2018',
      event: 'Make OH / IO',
      description: 'Online hackathon'
    },
    {
      year: '2017',
      event: 'Start-up Weekend',
      description: 'Entrepreneurship and innovation event'
    },
    {
      year: '2017',
      event: 'Hack4Algeria',
      description: 'Sylabs Algiers'
    },
  ]
};

export const WHITE_PAPERS_DATA = [
  {
    id: 1,
    title: 'Microservices Architecture',
    briefDescription: 'Comprehensive analysis of microservices design patterns and implementation strategies',
    fullDescription: 'This white paper explores the fundamental principles of microservices architecture, examining the transition from monolithic to distributed systems. It covers key design patterns, service decomposition strategies, communication protocols, and best practices for building scalable, maintainable microservices ecosystems.',
    keyPoints: [
      'Service decomposition and boundary identification',
      'Inter-service communication patterns and protocols',
      'Data consistency and distributed transaction management',
      'Deployment strategies and containerization',
      'Monitoring, logging, and observability in distributed systems',
      'Security considerations for microservices architectures'
    ],
    publishedDate: '2024',
    pages: '28 pages',
    category: 'Software Architecture'
  },
  {
    id: 2,
    title: 'AuraliX Concept',
    briefDescription: 'Revolutionary framework for decentralized multi-agent systems and autonomous coordination',
    fullDescription: 'The AuraliX Concept paper introduces a groundbreaking approach to decentralized multi-agent systems, leveraging blockchain technology and advanced consensus algorithms. This research presents a novel framework for autonomous agent coordination, enabling intelligent distributed computing at scale.',
    keyPoints: [
      'Decentralized agent coordination mechanisms',
      'Blockchain-based consensus for agent networks',
      'Autonomous decision-making algorithms',
      'Scalable multi-agent communication protocols',
      'Smart contract integration for agent governance',
      'Real-world applications and use cases'
    ],
    publishedDate: '2024',
    pages: '35 pages', 
    category: 'Distributed Systems'
  }
];

export const SKILLS_DATA = [
  {
    category: 'Backend Development',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Django', level: 90 },
      { name: 'FastAPI', level: 88 },
      { name: 'Flask', level: 85 },
      { name: 'Node.js', level: 75 },
    ],
  },
  {
    category: 'Databases',
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'MongoDB', level: 85 },
      { name: 'Redis', level: 80 },
      { name: 'MySQL', level: 85 },
      { name: 'DynamoDB', level: 75 },
    ],
  },
  {
    category: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', level: 88 },
      { name: 'Docker', level: 85 },
      { name: 'Kubernetes', level: 80 },
      { name: 'GCP', level: 75 },
      { name: 'CI/CD', level: 80 },
    ],
  },
  {
    category: 'AI & Machine Learning',
    skills: [
      { name: 'Machine Learning', level: 80 },
      { name: 'TensorFlow', level: 75 },
      { name: 'PyTorch', level: 70 },
      { name: 'NLP', level: 75 },
      { name: 'Computer Vision', level: 65 },
    ],
  },
];

export const VENTURES_DATA = [
  {
    name: 'Preview-Lab',
    role: 'Founder',
    period: '2024 - Present',
    type: 'Software Research Lab',
    description: 'A cutting-edge software research laboratory focused on experimental technologies and innovative development methodologies.',
    achievements: [
      'Established research initiatives in emerging software technologies',
      'Developed experimental frameworks for next-generation applications',
      'Created collaborative research environment for advanced software engineering',
      'Published research findings on modern software architecture patterns',
    ],
    technologies: ['Research', 'Innovation', 'Software Architecture', 'Experimental Tech', 'R&D'],
  },
  {
    name: 'ZYNIQ',
    role: 'Founder',
    period: '2023 - Present', 
    type: 'AI Driven Development Firm',
    description: 'An AI-driven development firm specializing in intelligent automation and next-generation software solutions.',
    achievements: [
      'Pioneered AI-assisted software development methodologies',
      'Delivered intelligent automation solutions to enterprise clients',
      'Developed proprietary AI tools for code generation and optimization',
      'Established industry partnerships for AI-driven development practices',
    ],
    technologies: ['AI/ML', 'Automation', 'Python', 'LLMs', 'DevOps', 'Cloud Architecture'],
  },
  {
    name: 'AuraliX',
    role: 'Founder',
    period: '2023 - Present',
    type: 'Decentralized Multi-Agent Framework',
    description: 'AuraliX is a decentralized, multi-agent framework designed for autonomous system coordination and intelligent distributed computing.',
    achievements: [
      'Architected decentralized multi-agent communication protocols',
      'Implemented autonomous decision-making algorithms for distributed systems',
      'Developed blockchain-based coordination mechanisms for agent networks',
      'Created scalable framework for enterprise multi-agent deployments',
    ],
    technologies: ['Blockchain', 'Multi-Agent Systems', 'Distributed Computing', 'Python', 'Smart Contracts', 'Consensus Algorithms'],
  },
];

export const RESUME_DATA_FOR_AI = `
Professional Summary:
Ibrahim El Khalil - Entrepreneur, Senior Software Engineer & AI Architect
Location: Dubai, UAE
Experience: 7+ years in backend development and AI systems

Current Role:
Senior API Engineer at FirstGroup for Shory KSA (Jul 2023 - Present)
- Leading API infrastructure development for KSA market launch
- Designing scalable microservices using Python, FastAPI, and Docker
- Managing cloud resources on AWS and GCP

Previous Experience:
1. Senior Backend Developer at Skyloov (Jul 2023)
   - Developed Python APIs using Django, Flask, PostgreSQL
   - Managed 4 microservices handling 100,000+ daily requests
   - Implemented AWS services (DynamoDB, Lambda, S3)

2. Senior Backend Developer at Pixel (Aug 2022 - Jul 2023)
   - Led digital transformation for 5 real estate firms
   - Increased operational efficiency by 25%
   - Developed SaaS solution impacting 100+ projects

3. Lead Backend Developer at FineTech Kio (Jun 2019 - Jun 2022)
   - Developed software tools for clients and internal customers
   - Led team of 3 developers in microservices architecture

Ventures:
- Co-Founder & CTO of AdvancedPython.ai (2023-Present): AI platform for Python development
- Founder of PythonGuide.net (2022-Present): Educational platform for Python developers

Education:
Bachelor of Computer Science from American University of the Middle East (2017-2021)
Graduated with Honors, specialized in Software Engineering

Core Skills:
Backend: Python (95%), Django (90%), FastAPI (88%), Flask (85%), Node.js (75%)
Databases: PostgreSQL (90%), MongoDB (85%), Redis (80%), MySQL (85%), DynamoDB (75%)
Cloud: AWS (88%), Docker (85%), Kubernetes (80%), GCP (75%), CI/CD (80%)
AI/ML: Machine Learning (80%), TensorFlow (75%), PyTorch (70%), NLP (75%)

Contact:
LinkedIn: https://www.linkedin.com/in/khalilpreview/
GitHub: https://github.com/ibrahimelgibran
Email: ibrahimelkhalilpreview@gmail.com
`;