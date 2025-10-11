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
  const [editingSection, setEditingSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'pass@123') {
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
        API.getProfile().catch(() => null),
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

  // Generic delete handler
  const handleDelete = async (section, id, apiDeleteFunc) => {
    if (!window.confirm(`Are you sure you want to delete this ${section}?`)) return;
    try {
      await apiDeleteFunc(id);
      await loadAllData();
      showMessage(`${section} deleted successfully!`);
    } catch (error) {
      showMessage(`Error deleting ${section}`, 'error');
    }
  };

  // Modal handlers
  const openModal = (section, item = null) => {
    setEditingItem(item);
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setEditingSection(null);
    setIsModalOpen(false);
  };

  const handleSaveFromModal = async (data) => {
    try {
      if (editingSection === 'profile') {
        await API.updateProfile(data);
      } else if (editingSection === 'experience') {
        if (editingItem) {
          await API.updateExperience(editingItem.id, data);
        } else {
          await API.createExperience(data);
        }
      } else if (editingSection === 'education') {
        if (editingItem) {
          await API.updateEducation(editingItem.id, data);
        } else {
          await API.createEducation(data);
        }
      } else if (editingSection === 'skills') {
        if (editingItem) {
          await API.updateSkillCategory(editingItem.id, data);
        } else {
          await API.createSkillCategory(data);
        }
      } else if (editingSection === 'ventures') {
        if (editingItem) {
          await API.updateVenture(editingItem.id, data);
        } else {
          await API.createVenture(data);
        }
      } else if (editingSection === 'whitepapers') {
        if (editingItem) {
          await API.updateWhitePaper(editingItem.id, data);
        } else {
          await API.createWhitePaper(data);
        }
      } else if (editingSection === 'achievements') {
        await API.updateAchievements(data);
      } else if (editingSection === 'appointments') {
        await API.updateAppointment(editingItem.id, data);
      }
      
      await loadAllData();
      showMessage('Saved successfully!');
      closeModal();
    } catch (error) {
      showMessage('Error saving', 'error');
    }
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
            { id: 'overview', label: '📊 Overview' },
            { id: 'profile', label: '👤 Profile' },
            { id: 'experience', label: '💼 Experience' },
            { id: 'education', label: '🎓 Education' },
            { id: 'skills', label: '🛠 Skills' },
            { id: 'ventures', label: '🚀 Ventures' },
            { id: 'achievements', label: '🏆 Achievements' },
            { id: 'whitepapers', label: '📄 White Papers' },
            { id: 'appointments', label: '📅 Appointments' },
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
            {activeSection === 'overview' && (
              <OverviewSection analytics={analytics} data={{ profile, experience, education, skills, ventures, achievements, whitePapers, appointments }} />
            )}
            {activeSection === 'profile' && (
              <ProfileSection profile={profile} onUpdate={handleProfileUpdate} openModal={openModal} />
            )}
            {activeSection === 'experience' && (
              <DataSection
                title="💼 Work Experience"
                data={experience}
                onAdd={() => openModal('experience')}
                onEdit={(item) => openModal('experience', item)}
                onDelete={(id) => handleDelete('experience', id, API.deleteExperience)}
                renderItem={(exp) => (
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-blue-400">{exp.company}</p>
                    <p className="text-gray-400 text-sm">{exp.period} • {exp.location}</p>
                  </div>
                )}
              />
            )}
            {activeSection === 'education' && (
              <DataSection
                title="🎓 Education"
                data={education}
                onAdd={() => openModal('education')}
                onEdit={(item) => openModal('education', item)}
                onDelete={(id) => handleDelete('education', id, API.deleteEducation)}
                renderItem={(edu) => (
                  <div>
                    <h3 className="text-xl font-bold text-white">{edu.degree}</h3>
                    <p className="text-blue-400">{edu.institution}</p>
                    <p className="text-gray-400 text-sm">{edu.period} • {edu.location}</p>
                  </div>
                )}
              />
            )}
            {activeSection === 'skills' && (
              <DataSection
                title="🛠 Skills & Technologies"
                data={skills}
                onAdd={() => openModal('skills')}
                onEdit={(item) => openModal('skills', item)}
                onDelete={(id) => handleDelete('skill category', id, API.deleteSkillCategory)}
                renderItem={(category) => (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{category.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills?.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/10 rounded-full text-sm">{skill.name} ({skill.level}%)</span>
                      ))}
                    </div>
                  </div>
                )}
              />
            )}
            {activeSection === 'ventures' && (
              <DataSection
                title="🚀 Ventures & Projects"
                data={ventures}
                onAdd={() => openModal('ventures')}
                onEdit={(item) => openModal('ventures', item)}
                onDelete={(id) => handleDelete('venture', id, API.deleteVenture)}
                renderItem={(venture) => (
                  <div>
                    <h3 className="text-xl font-bold text-white">{venture.name}</h3>
                    <p className="text-blue-400">{venture.role} • {venture.type}</p>
                    <p className="text-gray-400 text-sm">{venture.period}</p>
                  </div>
                )}
              />
            )}
            {activeSection === 'achievements' && (
              <AchievementsSection achievements={achievements} openModal={openModal} />
            )}
            {activeSection === 'whitepapers' && (
              <DataSection
                title="📄 White Papers"
                data={whitePapers}
                onAdd={() => openModal('whitepapers')}
                onEdit={(item) => openModal('whitepapers', item)}
                onDelete={(id) => handleDelete('white paper', id, API.deleteWhitePaper)}
                renderItem={(paper) => (
                  <div>
                    <h3 className="text-xl font-bold text-white">{paper.title}</h3>
                    <p className="text-gray-400 text-sm">{paper.category} • {paper.publishedDate} • {paper.pages}</p>
                  </div>
                )}
              />
            )}
            {activeSection === 'appointments' && (
              <AppointmentsSection 
                appointments={appointments}
                openModal={openModal}
                onDelete={(id) => handleDelete('appointment', id, API.deleteAppointment)}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditModal
          section={editingSection}
          item={editingItem}
          onClose={closeModal}
          onSave={handleSaveFromModal}
        />
      )}
    </div>
  );
};

// Overview Section
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

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
  };
  
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-md border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-gray-300 text-sm">{title}</p>
    </div>
  );
};

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
const ProfileSection = ({ profile, onUpdate, openModal }) => {
  const [formData, setFormData] = useState(profile || {});

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No profile data found. The system will migrate data automatically on first page load.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">👤 Edit Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Summary</label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => setFormData({...formData, summary: e.target.value})}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-24"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image || ''}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.linkedin || ''}
              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              value={formData.github || ''}
              onChange={(e) => setFormData({...formData, github: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

// Generic Data Section Component
const DataSection = ({ title, data, onAdd, onEdit, onDelete, renderItem }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
      >
        + Add New
      </button>
    </div>
    <div className="space-y-4">
      {data && data.length > 0 ? (
        data.map((item) => (
          <div key={item.id || item._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start">
              {renderItem(item)}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(item)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id || item._id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-xl">
          <p className="text-gray-400">No entries yet. Click "Add New" to create one.</p>
        </div>
      )}
    </div>
  </div>
);

// Achievements Section
const AchievementsSection = ({ achievements, openModal }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">🏆 Achievements</h2>
      <button
        onClick={() => openModal('achievements', achievements)}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
      >
        Edit All
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Certificates ({achievements.certificates?.length || 0})</h3>
        <div className="space-y-2">
          {achievements.certificates?.map((cert, idx) => (
            <div key={idx} className="bg-white/5 p-3 rounded">
              <p className="font-medium">{cert.name}</p>
              <p className="text-sm text-gray-400">{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Hackathons ({achievements.hackathons?.length || 0})</h3>
        <div className="space-y-2">
          {achievements.hackathons?.map((hack, idx) => (
            <div key={idx} className="bg-white/5 p-3 rounded">
              <p className="font-medium">{hack.event}</p>
              <p className="text-sm text-gray-400">{hack.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Appointments Section
const AppointmentsSection = ({ appointments, openModal, onDelete }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6">📅 Appointments</h2>
    <div className="space-y-4">
      {appointments && appointments.length > 0 ? (
        appointments.map((apt) => (
          <div key={apt.id || apt._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-white">{apt.name}</h3>
                <p className="text-gray-400">{apt.email}</p>
                <p className="text-sm text-gray-500">{apt.date} at {apt.time}</p>
                <p className="text-sm text-gray-400 mt-2">{apt.reason}</p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                    apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                    apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('appointments', apt)}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(apt.id || apt._id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-xl">
          <p className="text-gray-400">No appointments yet.</p>
        </div>
      )}
    </div>
  </div>
);

// Edit Modal - This will be expanded with forms for each section
const EditModal = ({ section, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderForm = () => {
    // For now, a simple JSON editor - will be expanded
    return (
      <div>
        <p className="text-gray-400 mb-4">Full form editing will be implemented. For now, you can edit profile directly in the Profile section.</p>
        <p className="text-sm text-gray-500">Section: {section}</p>
        <p className="text-sm text-gray-500">Mode: {item ? 'Edit' : 'Create'}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{item ? 'Edit' : 'Add'} {section}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;