# 🎯 Interactive Portfolio Application

<div align="center">

![Portfolio Banner](https://img.shields.io/badge/Portfolio-Interactive-red?style=for-the-badge&logo=react)
![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A stunning, interactive portfolio application with 3D business card, AI-powered chat, and comprehensive admin dashboard.**

[Live Demo](https://smartportal-2.preview.emergentagent.com) • [Documentation](./instructions.md) • [Report Bug](mailto:contact@khalilpreview.space)

</div>

---

## ✨ Features

### 🎴 3D Business Card Landing Page
- **Stunning 3D Flip Animation** - Interactive card with smooth rotation effects
- **Black & Red Premium Theme** - Professional dark aesthetic with red accents
- **Glowing Border Effects** - Pulsing red glow for visual impact
- **Contact Information** - Email, phone, and location prominently displayed
- **Non-Scrollable Design** - Full-screen experience without distractions
- **Animated Background** - Floating particles and ambient effects

### 📱 Dynamic Portfolio Page
- **Professional Loading Animation** - 5-step initialization sequence
- **Comprehensive Sections:**
  - 👤 Hero Section with profile information
  - 💼 Work Experience timeline
  - 🚀 Ventures & Projects showcase
  - 🎓 Education history
  - 🏆 Achievements & Certifications
  - 📄 White Papers with detailed popups
- **Interactive Skills Popup** - Searchable skills with proficiency levels
- **Responsive Design** - Perfect on all devices

### 🤖 AI-Powered Features
- **Smart Chat Assistant** - Google Gemini integration
- **Voice Mode** - Speech recognition for hands-free interaction
- **Context-Aware Responses** - Understands portfolio context
- **Real-Time Analytics** - Track visitor engagement

### 📅 Appointment System
- **Interactive Booking** - Multi-step calendar selection
- **Bookmark Interface** - Floating button with smooth animations
- **Email Notifications** - Automated confirmation (ready for integration)
- **Admin Management** - View and manage appointments

### 🎛️ Admin Dashboard
- **Secure Access** - Password-protected admin panel
- **Real-Time Analytics:**
  - 👁️ Total visits tracking
  - 💬 AI chat session monitoring
  - 🛠️ Skills popup views
  - 📅 Appointment metrics
- **Content Management:**
  - ✏️ Edit profile information
  - ➕ Add/Edit/Delete experience entries
  - 🎓 Manage education records
  - 🛠️ Update skills and technologies
  - 🚀 Manage ventures and projects
  - 📄 White papers administration
- **Database Integration** - MongoDB for persistent storage
- **Auto-Migration** - Seamless data import from constants

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - Modern UI library
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool

### Backend
- **FastAPI** - High-performance Python framework
- **MongoDB** - NoSQL database for flexible data storage
- **Pydantic** - Data validation and settings management
- **Python 3.10+** - Modern Python features

### AI & Integrations
- **Google Gemini API** - Advanced AI chat capabilities
- **Web Speech API** - Voice recognition

### DevOps
- **Supervisor** - Process management
- **Nginx** - Reverse proxy (via Kubernetes)
- **Docker** - Containerization (K8s environment)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and Yarn
- Python 3.10+
- MongoDB (running locally or connection string)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd app

# Install frontend dependencies
cd frontend
yarn install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit .env files with your API keys and configuration
```

### Environment Variables

**Frontend** (`.env`):
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Backend** (`.env`):
```env
MONGO_URL=mongodb://localhost:27017/
DATABASE_NAME=portfolio_db
```

### Running Locally

```bash
# Terminal 1 - Start Backend
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Terminal 2 - Start Frontend
cd frontend
yarn start
```

Visit: `http://localhost:3000`

### Running with Supervisor (Production)

```bash
# Restart all services
sudo supervisorctl restart all

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/frontend.err.log
tail -f /var/log/supervisor/backend.err.log
```

---

## 📁 Project Structure

```
app/
├── 📂 backend/
│   ├── server.py              # FastAPI application with all endpoints
│   ├── database.py            # MongoDB connection and collections
│   ├── models.py              # Pydantic data models
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
├── 📂 frontend/
│   ├── 📂 public/
│   │   └── index.html         # HTML entry point
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── BusinessCardPage.js      # 3D business card (landing)
│   │   │   ├── AdminDashboard.js        # Admin panel
│   │   │   ├── Hero.js                  # Profile header
│   │   │   ├── Experience.js            # Work history
│   │   │   ├── Education.js             # Educational background
│   │   │   ├── Ventures.js              # Projects showcase
│   │   │   ├── OtherAchievements.js     # Certificates & hackathons
│   │   │   ├── SkillsPopup.js           # Skills modal with search
│   │   │   ├── AiChat.js                # AI chat interface
│   │   │   ├── AppointmentBooking.js    # Booking form
│   │   │   ├── AppointmentManager.js    # Booking manager
│   │   │   └── BookmarkBar.js           # Floating action buttons
│   │   ├── 📂 services/
│   │   │   ├── apiService.js            # Backend API client
│   │   │   └── geminiService.js         # Google Gemini integration
│   │   ├── App.js                       # Main application & routing
│   │   ├── constants.js                 # Static data (being phased out)
│   │   ├── App.css                      # Global styles
│   │   └── index.css                    # Tailwind base
│   ├── package.json           # Node dependencies
│   └── .env                   # Frontend environment variables
├── instructions.md            # 📘 Detailed development guide
└── README.md                  # 📖 This file
```

---

## 🎨 Design Philosophy

### Color Palette
- **Primary**: Black (#000000) to Dark Red (#330000)
- **Accent**: Red (#FF0000) with various opacities
- **Text**: White (#FFFFFF) and Gray shades
- **Success**: Green (#00FF00)
- **Warning**: Yellow/Orange tones

### Animation Principles
- **Smooth Transitions** - All state changes animated
- **Micro-interactions** - Hover effects and feedback
- **3D Transforms** - Depth and perspective effects
- **Performance-First** - GPU-accelerated animations

### UX Principles
- **Progressive Disclosure** - Information revealed when needed
- **Clear Hierarchy** - Visual weight guides attention
- **Accessibility** - Keyboard navigation and ARIA labels
- **Mobile-First** - Responsive from ground up

---

## 🌐 API Documentation

### Base URL
```
https://smartportal-2.preview.emergentagent.com/api
```

### Endpoints

#### Profile
```http
GET    /api/profile        # Get profile information
PUT    /api/profile        # Update profile
```

#### Experience
```http
GET    /api/experience     # List all experience entries
POST   /api/experience     # Create new experience
PUT    /api/experience/:id # Update experience
DELETE /api/experience/:id # Delete experience
```

#### Education
```http
GET    /api/education      # List all education entries
POST   /api/education      # Create new education
PUT    /api/education/:id  # Update education
DELETE /api/education/:id  # Delete education
```

#### Skills
```http
GET    /api/skills         # List all skill categories
POST   /api/skills         # Create new category
PUT    /api/skills/:id     # Update category
DELETE /api/skills/:id     # Delete category
```

#### Ventures
```http
GET    /api/ventures       # List all ventures
POST   /api/ventures       # Create new venture
PUT    /api/ventures/:id   # Update venture
DELETE /api/ventures/:id   # Delete venture
```

#### Achievements
```http
GET    /api/achievements   # Get certificates & hackathons
PUT    /api/achievements   # Update achievements
```

#### White Papers
```http
GET    /api/whitepapers    # List all white papers
POST   /api/whitepapers    # Create new paper
PUT    /api/whitepapers/:id # Update paper
DELETE /api/whitepapers/:id # Delete paper
```

#### Appointments
```http
GET    /api/appointments   # List all appointments
POST   /api/appointments   # Create appointment
PUT    /api/appointments/:id # Update appointment
DELETE /api/appointments/:id # Delete appointment
```

#### Analytics
```http
GET    /api/analytics      # Get analytics data
POST   /api/analytics/track # Track event (visit, ai_chat, skills_view)
```

#### Utilities
```http
POST   /api/migrate        # Migrate data from constants.js
GET    /api/health         # Health check
```

---

## 🔒 Admin Access

### Login Credentials
- **URL**: `/admin`
- **Password**: `pass@123`

### Admin Features
1. **Dashboard Overview** - Real-time analytics and stats
2. **Profile Management** - Edit personal information
3. **Content Management** - Full CRUD for all sections
4. **Appointment Management** - View and update bookings
5. **Analytics Monitoring** - Track visitor behavior

---

## 📊 Database Schema

### Collections

#### `profile`
```javascript
{
  name: String,
  title: String,
  location: String,
  summary: String,
  image: String,
  linkedin: String,
  github: String,
  email: String
}
```

#### `experience`
```javascript
{
  id: String,
  role: String,
  company: String,
  period: String,
  location: String,
  description: [String],
  projects: [{ name: String, description: String }]
}
```

#### `skills`
```javascript
{
  id: String,
  category: String,
  skills: [{ name: String, level: Number }]
}
```

#### `appointments`
```javascript
{
  id: String,
  name: String,
  email: String,
  reason: String,
  date: String,
  time: String,
  status: String,  // 'pending', 'confirmed', 'cancelled'
  created_at: String
}
```

#### `analytics`
```javascript
{
  total_visits: Number,
  unique_visitors: Number,
  ai_chat_sessions: Number,
  appointments_booked: Number,
  skills_viewed: Number,
  last_updated: String
}
```

---

## 🧪 Testing

### Manual Testing
1. Visit `/` - Verify business card appears
2. Click card - Verify flip animation
3. Click "Enter Portfolio" - Verify navigation
4. Test all interactive elements
5. Visit `/admin` - Test admin features

### API Testing with curl
```bash
# Health check
curl https://smartportal-2.preview.emergentagent.com/api/health

# Get profile
curl https://smartportal-2.preview.emergentagent.com/api/profile

# Get analytics
curl https://smartportal-2.preview.emergentagent.com/api/analytics

# Track event
curl -X POST https://smartportal-2.preview.emergentagent.com/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"event_type": "visit"}'
```

---

## 🐛 Known Issues & Limitations

### Current Limitations
- ⚠️ Admin edit modals are placeholders (see [instructions.md](./instructions.md))
- ⚠️ Portfolio sections still use static data from `constants.js`
- ⚠️ Analytics charts not implemented
- ⚠️ Image upload uses URLs (no file upload yet)
- ⚠️ QR code on business card is placeholder

### Planned Features
- 📊 Analytics charts and graphs
- 📤 Export portfolio data (JSON/PDF)
- 📥 Import portfolio data (JSON)
- 🖼️ Image upload with base64 storage
- 🔔 Email notifications for appointments
- 📱 Progressive Web App (PWA) support
- 🌍 Multi-language support
- 🎨 Theme customization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed
- See [instructions.md](./instructions.md) for detailed dev guide

---

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Ibrahim El Khalil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

**Ibrahim El Khalil**

- 📧 Email: [contact@khalilpreview.space](mailto:contact@khalilpreview.space)
- 📱 Phone: +971 585 774 519
- 🌍 Location: Dubai, UAE
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/ibrahimelgibran)
- 💻 GitHub: [@ibrahimelgibran](https://github.com/ibrahimelgibran)

---

## 🙏 Acknowledgments

- **Google Gemini** - AI chat capabilities
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling framework
- **FastAPI** - Backend framework
- **MongoDB** - Database solution
- **React** - UI library
- **Emergent Agent** - Development platform

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

---

<div align="center">

**Built with ❤️ by Ibrahim El Khalil**

**© 2025 IEK Portfolio By ZYNIQ. All rights reserved.**

[🏠 Home](https://smartportal-2.preview.emergentagent.com) • [📊 Admin](https://smartportal-2.preview.emergentagent.com/admin) • [📧 Contact](mailto:contact@khalilpreview.space)

</div>
