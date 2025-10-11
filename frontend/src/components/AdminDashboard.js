import React, { useState, useEffect } from 'react';
import * as API from '../services/apiService';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Data states
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [ventures, setVentures] = useState([]);
  const [achievements, setAchievements] = useState({ certificates: [], hackathons: [] });
  const [whitePapers, setWhitePapers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Editing states
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      loadAllData();
    } else {
      showMessage('Invalid password!', 'error');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_authenticated');
    if (saved === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  // Show message
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [profileData, expData, eduData, skillsData, venturesData, achData, papersData, aptData, analyticsData] = await Promise.all([
        API.getProfile(),
        API.getExperience(),
        API.getEducation(),
        API.getSkills(),
        API.getVentures(),
        API.getAchievements(),
        API.getWhitePapers(),
        API.getAppointments(),
        API.getAnalytics()
      ]);
      
      setProfile(profileData);
      setExperience(expData);
      setEducation(eduData);
      setSkills(skillsData);
      setVentures(venturesData);
      setAchievements(achData);
      setWhitePapers(papersData);
      setAppointments(aptData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showMessage('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Profile handlers
  const handleProfileUpdate = async (updatedProfile) => {
    try {
      await API.updateProfile(updatedProfile);
      setProfile(updatedProfile);
      showMessage('Profile updated successfully!');
    } catch (error) {
      showMessage('Error updating profile', 'error');
    }
  };

  // Experience handlers
  const handleExperienceCreate = async (data) => {
    try {
      await API.createExperience(data);
      await loadAllData();
      showMessage('Experience added successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error adding experience', 'error');
    }
  };

  const handleExperienceUpdate = async (id, data) => {
    try {
      await API.updateExperience(id, data);
      await loadAllData();
      showMessage('Experience updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating experience', 'error');
    }
  };

  const handleExperienceDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    try {
      await API.deleteExperience(id);
      await loadAllData();
      showMessage('Experience deleted successfully!');
    } catch (error) {
      showMessage('Error deleting experience', 'error');
    }
  };

  // Education handlers
  const handleEducationCreate = async (data) => {
    try {
      await API.createEducation(data);
      await loadAllData();
      showMessage('Education added successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error adding education', 'error');
    }
  };

  const handleEducationUpdate = async (id, data) => {
    try {
      await API.updateEducation(id, data);
      await loadAllData();
      showMessage('Education updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating education', 'error');
    }
  };

  const handleEducationDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await API.deleteEducation(id);
      await loadAllData();
      showMessage('Education deleted successfully!');
    } catch (error) {
      showMessage('Error deleting education', 'error');
    }
  };

  // Skills handlers
  const handleSkillCreate = async (data) => {
    try {
      await API.createSkillCategory(data);
      await loadAllData();
      showMessage('Skill category added successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error adding skill category', 'error');
    }
  };

  const handleSkillUpdate = async (id, data) => {
    try {
      await API.updateSkillCategory(id, data);
      await loadAllData();
      showMessage('Skill category updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating skill category', 'error');
    }
  };

  const handleSkillDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill category?')) return;
    try {
      await API.deleteSkillCategory(id);
      await loadAllData();
      showMessage('Skill category deleted successfully!');
    } catch (error) {
      showMessage('Error deleting skill category', 'error');
    }
  };

  // Venture handlers
  const handleVentureCreate = async (data) => {
    try {
      await API.createVenture(data);
      await loadAllData();
      showMessage('Venture added successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error adding venture', 'error');
    }
  };

  const handleVentureUpdate = async (id, data) => {
    try {
      await API.updateVenture(id, data);
      await loadAllData();
      showMessage('Venture updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating venture', 'error');
    }
  };

  const handleVentureDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venture?')) return;
    try {
      await API.deleteVenture(id);
      await loadAllData();
      showMessage('Venture deleted successfully!');
    } catch (error) {
      showMessage('Error deleting venture', 'error');
    }
  };

  // White Paper handlers
  const handleWhitePaperCreate = async (data) => {
    try {
      await API.createWhitePaper(data);
      await loadAllData();
      showMessage('White paper added successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error adding white paper', 'error');
    }
  };

  const handleWhitePaperUpdate = async (id, data) => {
    try {
      await API.updateWhitePaper(id, data);
      await loadAllData();
      showMessage('White paper updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating white paper', 'error');
    }
  };

  const handleWhitePaperDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this white paper?')) return;
    try {
      await API.deleteWhitePaper(id);
      await loadAllData();
      showMessage('White paper deleted successfully!');
    } catch (error) {
      showMessage('Error deleting white paper', 'error');
    }
  };

  // Achievements handlers
  const handleAchievementsUpdate = async (data) => {
    try {
      await API.updateAchievements(data);
      await loadAllData();
      showMessage('Achievements updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating achievements', 'error');
    }
  };

  // Appointment handlers
  const handleAppointmentUpdate = async (id, data) => {
    try {
      await API.updateAppointment(id, data);
      await loadAllData();
      showMessage('Appointment updated successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error updating appointment', 'error');
    }
  };

  const handleAppointmentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await API.deleteAppointment(id);
      await loadAllData();
      showMessage('Appointment deleted successfully!');
    } catch (error) {
      showMessage('Error deleting appointment', 'error');
    }
  };

  // Modal handlers
  const openModal = (section, item = null) => {
    setEditingItem(item);
    setActiveSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">🔐 Admin Access</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <a href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
              View Portfolio
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-right`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'profile', label: '👤 Profile', icon: '👤' },
            { id: 'experience', label: '💼 Experience', icon: '💼' },
            { id: 'education', label: '🎓 Education', icon: '🎓' },
            { id: 'skills', label: '🛠 Skills', icon: '🛠' },
            { id: 'ventures', label: '🚀 Ventures', icon: '🚀' },
            { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
            { id: 'whitepapers', label: '📄 White Papers', icon: '📄' },
            { id: 'appointments', label: '📅 Appointments', icon: '📅' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeSection === 'overview' && <OverviewSection analytics={analytics} data={{ profile, experience, education, skills, ventures, achievements, whitePapers, appointments }} />}
            {activeSection === 'profile' && <ProfileSection profile={profile} onUpdate={handleProfileUpdate} />}
            {activeSection === 'experience' && <ExperienceSection experience={experience} onCreate={handleExperienceCreate} onUpdate={handleExperienceUpdate} onDelete={handleExperienceDelete} openModal={openModal} />}
            {activeSection === 'education' && <EducationSection education={education} onCreate={handleEducationCreate} onUpdate={handleEducationUpdate} onDelete={handleEducationDelete} openModal={openModal} />}
            {activeSection === 'skills' && <SkillsSection skills={skills} onCreate={handleSkillCreate} onUpdate={handleSkillUpdate} onDelete={handleSkillDelete} openModal={openModal} />}
            {activeSection === 'ventures' && <VenturesSection ventures={ventures} onCreate={handleVentureCreate} onUpdate={handleVentureUpdate} onDelete={handleVentureDelete} openModal={openModal} />}
            {activeSection === 'achievements' && <AchievementsSection achievements={achievements} onUpdate={handleAchievementsUpdate} openModal={openModal} />}
            {activeSection === 'whitepapers' && <WhitePapersSection whitePapers={whitePapers} onCreate={handleWhitePaperCreate} onUpdate={handleWhitePaperUpdate} onDelete={handleWhitePaperDelete} openModal={openModal} />}
            {activeSection === 'appointments' && <AppointmentsSection appointments={appointments} onUpdate={handleAppointmentUpdate} onDelete={handleAppointmentDelete} openModal={openModal} />}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditModal
          section={activeSection}
          item={editingItem}
          onClose={closeModal}
          onSave={(
            activeSection === 'experience' ? (editingItem ? (data) => handleExperienceUpdate(editingItem.id, data) : handleExperienceCreate) :
            activeSection === 'education' ? (editingItem ? (data) => handleEducationUpdate(editingItem.id, data) : handleEducationCreate) :
            activeSection === 'skills' ? (editingItem ? (data) => handleSkillUpdate(editingItem.id, data) : handleSkillCreate) :
            activeSection === 'ventures' ? (editingItem ? (data) => handleVentureUpdate(editingItem.id, data) : handleVentureCreate) :
            activeSection === 'whitepapers' ? (editingItem ? (data) => handleWhitePaperUpdate(editingItem.id, data) : handleWhitePaperCreate) :
            activeSection === 'appointments' ? (data) => handleAppointmentUpdate(editingItem.id, data) :
            activeSection === 'achievements' ? handleAchievementsUpdate :
            null
          )}
        />
      )}
    </div>
  );
};

// Component sections will be defined below
const OverviewSection = ({ analytics, data }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Visits" value={analytics.total_visits || 0} icon="👁️" color="blue" />
      <StatCard title="AI Chat Sessions" value={analytics.ai_chat_sessions || 0} icon="💬" color="green" />
      <StatCard title="Skills Viewed" value={analytics.skills_viewed || 0} icon="🛠" color="purple" />
      <StatCard title="Appointments" value={analytics.appointments_booked || 0} icon="📅" color="red" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DataCard title="Experience Entries" count={data.experience?.length || 0} icon="💼" />
      <DataCard title="Education Entries" count={data.education?.length || 0} icon="🎓" />
      <DataCard title="Skill Categories" count={data.skills?.length || 0} icon="🛠" />
      <DataCard title="Ventures" count={data.ventures?.length || 0} icon="🚀" />
      <DataCard title="White Papers" count={data.whitePapers?.length || 0} icon="📄" />
      <DataCard title="Certificates" count={data.achievements?.certificates?.length || 0} icon="🏆" />
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 backdrop-blur-md border border-${color}-500/30 rounded-xl p-6`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">{icon}</span>
      <span className={`text-3xl font-bold text-${color}-400`}>{value}</span>
    </div>
    <p className="text-gray-300 text-sm">{title}</p>
  </div>
);

const DataCard = ({ title, count, icon }) => (
  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
      <span className="text-4xl opacity-50">{icon}</span>
    </div>
  </div>
);

// Profile Section
const ProfileSection = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState(profile || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div>
      <h2 className=\"text-2xl font-bold mb-6\">\ud83d\udc64 Edit Profile</h2>
      <form onSubmit={handleSubmit} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4\">\n        <div>\n          <label className=\"block text-sm font-medium mb-2\">Name</label>\n          <input type=\"text\" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" required />\n        </div>\n        <div>\n          <label className=\"block text-sm font-medium mb-2\">Title</label>\n          <input type=\"text\" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" required />\n        </div>\n        <div>\n          <label className=\"block text-sm font-medium mb-2\">Location</label>\n          <input type=\"text\" value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" required />\n        </div>\n        <div>\n          <label className=\"block text-sm font-medium mb-2\">Summary</label>\n          <textarea value={formData.summary || ''} onChange={(e) => setFormData({...formData, summary: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-24\" required />\n        </div>\n        <div>\n          <label className=\"block text-sm font-medium mb-2\">Image URL</label>\n          <input type=\"url\" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" required />\n        </div>\n        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n          <div>\n            <label className=\"block text-sm font-medium mb-2\">LinkedIn URL</label>\n            <input type=\"url\" value={formData.linkedin || ''} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" />\n          </div>\n          <div>\n            <label className=\"block text-sm font-medium mb-2\">GitHub URL</label>\n            <input type=\"url\" value={formData.github || ''} onChange={(e) => setFormData({...formData, github: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" />\n          </div>\n          <div>\n            <label className=\"block text-sm font-medium mb-2\">Email</label>\n            <input type=\"email\" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} className=\"w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white\" />\n          </div>\n        </div>\n        <button type=\"submit\" className=\"px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors\">\n          Save Profile\n        </button>\n      </form>\n    </div>\n  );\n};\n\n// Experience Section\nconst ExperienceSection = ({ experience, onCreate, onUpdate, onDelete, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83d\udcbc Work Experience</h2>\n      <button onClick={() => openModal('experience')} className=\"px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg\">+ Add Experience</button>\n    </div>\n    <div className=\"space-y-4\">\n      {experience.map((exp) => (\n        <div key={exp.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start mb-2\">\n            <div>\n              <h3 className=\"text-xl font-bold text-white\">{exp.role}</h3>\n              <p className=\"text-blue-400\">{exp.company}</p>\n              <p className=\"text-gray-400 text-sm\">{exp.period} • {exp.location}</p>\n            </div>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('experience', exp)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(exp.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// Education Section\nconst EducationSection = ({ education, onCreate, onUpdate, onDelete, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83c\udf93 Education</h2>\n      <button onClick={() => openModal('education')} className=\"px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg\">+ Add Education</button>\n    </div>\n    <div className=\"space-y-4\">\n      {education.map((edu) => (\n        <div key={edu.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start\">\n            <div>\n              <h3 className=\"text-xl font-bold text-white\">{edu.degree}</h3>\n              <p className=\"text-blue-400\">{edu.institution}</p>\n              <p className=\"text-gray-400 text-sm\">{edu.period} • {edu.location}</p>\n            </div>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('education', edu)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(edu.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// Skills Section\nconst SkillsSection = ({ skills, onCreate, onUpdate, onDelete, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83d\udee0 Skills & Technologies</h2>\n      <button onClick={() => openModal('skills')} className=\"px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg\">+ Add Category</button>\n    </div>\n    <div className=\"space-y-4\">\n      {skills.map((category) => (\n        <div key={category.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start mb-4\">\n            <h3 className=\"text-xl font-bold text-white\">{category.category}</h3>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('skills', category)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(category.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n          <div className=\"flex flex-wrap gap-2\">\n            {category.skills.map((skill, idx) => (\n              <span key={idx} className=\"px-3 py-1 bg-white/10 rounded-full text-sm\">{skill.name} ({skill.level}%)</span>\n            ))}\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// Ventures Section\nconst VenturesSection = ({ ventures, onCreate, onUpdate, onDelete, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83d\ude80 Ventures & Projects</h2>\n      <button onClick={() => openModal('ventures')} className=\"px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg\">+ Add Venture</button>\n    </div>\n    <div className=\"space-y-4\">\n      {ventures.map((venture) => (\n        <div key={venture.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start\">\n            <div>\n              <h3 className=\"text-xl font-bold text-white\">{venture.name}</h3>\n              <p className=\"text-blue-400\">{venture.role} • {venture.type}</p>\n              <p className=\"text-gray-400 text-sm\">{venture.period}</p>\n            </div>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('ventures', venture)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(venture.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// White Papers Section\nconst WhitePapersSection = ({ whitePapers, onCreate, onUpdate, onDelete, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83d\udcc4 White Papers</h2>\n      <button onClick={() => openModal('whitepapers')} className=\"px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg\">+ Add Paper</button>\n    </div>\n    <div className=\"space-y-4\">\n      {whitePapers.map((paper) => (\n        <div key={paper.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start\">\n            <div>\n              <h3 className=\"text-xl font-bold text-white\">{paper.title}</h3>\n              <p className=\"text-gray-400 text-sm\">{paper.category} • {paper.publishedDate} • {paper.pages}</p>\n            </div>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('whitepapers', paper)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(paper.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// Achievements Section\nconst AchievementsSection = ({ achievements, onUpdate, openModal }) => (\n  <div>\n    <div className=\"flex items-center justify-between mb-6\">\n      <h2 className=\"text-2xl font-bold\">\ud83c\udfc6 Achievements</h2>\n      <button onClick={() => openModal('achievements', achievements)} className=\"px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg\">Edit All</button>\n    </div>\n    <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">\n      <div className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n        <h3 className=\"text-lg font-bold mb-4\">Certificates ({achievements.certificates?.length || 0})</h3>\n        <div className=\"space-y-2\">\n          {achievements.certificates?.map((cert, idx) => (\n            <div key={idx} className=\"bg-white/5 p-3 rounded\">\n              <p className=\"font-medium\">{cert.name}</p>\n              <p className=\"text-sm text-gray-400\">{cert.issuer} • {cert.year}</p>\n            </div>\n          ))}\n        </div>\n      </div>\n      <div className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n        <h3 className=\"text-lg font-bold mb-4\">Hackathons ({achievements.hackathons?.length || 0})</h3>\n        <div className=\"space-y-2\">\n          {achievements.hackathons?.map((hack, idx) => (\n            <div key={idx} className=\"bg-white/5 p-3 rounded\">\n              <p className=\"font-medium\">{hack.event}</p>\n              <p className=\"text-sm text-gray-400\">{hack.year}</p>\n            </div>\n          ))}\n        </div>\n      </div>\n    </div>\n  </div>\n);\n\n// Appointments Section\nconst AppointmentsSection = ({ appointments, onUpdate, onDelete, openModal }) => (\n  <div>\n    <h2 className=\"text-2xl font-bold mb-6\">\ud83d\udcc5 Appointments</h2>\n    <div className=\"space-y-4\">\n      {appointments.map((apt) => (\n        <div key={apt.id} className=\"bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6\">\n          <div className=\"flex justify-between items-start\">\n            <div>\n              <h3 className=\"text-lg font-bold text-white\">{apt.name}</h3>\n              <p className=\"text-gray-400\">{apt.email}</p>\n              <p className=\"text-sm text-gray-500\">{apt.date} at {apt.time}</p>\n              <p className=\"text-sm text-gray-400 mt-2\">{apt.reason}</p>\n              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${\n                apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :\n                apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :\n                'bg-yellow-500/20 text-yellow-400'\n              }`}>{apt.status}</span>\n            </div>\n            <div className=\"flex gap-2\">\n              <button onClick={() => openModal('appointments', apt)} className=\"px-3 py-1 bg-blue-500/20 text-blue-400 rounded\">Edit</button>\n              <button onClick={() => onDelete(apt.id)} className=\"px-3 py-1 bg-red-500/20 text-red-400 rounded\">Delete</button>\n            </div>\n          </div>\n        </div>\n      ))}\n    </div>\n  </div>\n);\n\n// Simple Edit Modal (placeholder - would need full implementation for each type)\nconst EditModal = ({ section, item, onClose, onSave }) => {\n  return (\n    <div className=\"fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4\">\n      <div className=\"bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto\">\n        <div className=\"flex justify-between items-center mb-6\">\n          <h3 className=\"text-2xl font-bold\">{item ? 'Edit' : 'Add'} {section}</h3>\n          <button onClick={onClose} className=\"text-gray-400 hover:text-white\">\u00d7</button>\n        </div>\n        <p className=\"text-gray-400\">Modal form for {section} will be implemented here</p>\n        <div className=\"mt-6 flex gap-3\">\n          <button onClick={onClose} className=\"px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg\">Cancel</button>\n          <button onClick={onClose} className=\"px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg\">Save</button>\n        </div>\n      </div>\n    </div>\n  );\n};\n\nexport default AdminDashboard;