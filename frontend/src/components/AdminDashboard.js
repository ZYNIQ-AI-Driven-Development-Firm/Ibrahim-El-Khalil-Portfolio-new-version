import React, { useState, useEffect } from 'react';
import * as API from '../services/apiService';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Brute force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

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
  const [envVars, setEnvVars] = useState({});
  const [aiInstructions, setAiInstructions] = useState('');
  const [systemStatus, setSystemStatus] = useState(null);

  // Editing states
  const [editingItem, setEditingItem] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Authentication
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      showMessage(`Login blocked! Please wait ${Math.ceil(blockTimeRemaining / 60)} more minutes.`, 'error');
      return;
    }

    if (password === 'pass@123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      localStorage.removeItem('admin_failed_attempts');
      localStorage.removeItem('admin_block_time');
      loadAllData();
    } else {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('admin_failed_attempts', newFailedAttempts.toString());
      
      if (newFailedAttempts >= 3) {
        const blockDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
        const blockUntil = Date.now() + blockDuration;
        localStorage.setItem('admin_block_time', blockUntil.toString());
        setIsBlocked(true);
        setBlockTimeRemaining(blockDuration);
        showMessage('Too many failed attempts! Login blocked for 15 minutes.', 'error');
        
        // Start countdown timer
        const countdownInterval = setInterval(() => {
          const remaining = blockUntil - Date.now();
          if (remaining <= 0) {
            setIsBlocked(false);
            setBlockTimeRemaining(0);
            setFailedAttempts(0);
            localStorage.removeItem('admin_failed_attempts');
            localStorage.removeItem('admin_block_time');
            clearInterval(countdownInterval);
          } else {
            setBlockTimeRemaining(remaining);
          }
        }, 1000);
      } else {
        showMessage(`Invalid password! ${3 - newFailedAttempts} attempts remaining.`, 'error');
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_authenticated');
    if (saved === 'true') {
      setIsAuthenticated(true);
      loadAllData();
    }
    
    // Check for existing block and failed attempts
    const storedFailedAttempts = localStorage.getItem('admin_failed_attempts');
    const storedBlockTime = localStorage.getItem('admin_block_time');
    
    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts));
    }
    
    if (storedBlockTime) {
      const blockUntil = parseInt(storedBlockTime);
      const remaining = blockUntil - Date.now();
      
      if (remaining > 0) {
        setIsBlocked(true);
        setBlockTimeRemaining(remaining);
        
        // Continue countdown timer
        const countdownInterval = setInterval(() => {
          const timeLeft = blockUntil - Date.now();
          if (timeLeft <= 0) {
            setIsBlocked(false);
            setBlockTimeRemaining(0);
            setFailedAttempts(0);
            localStorage.removeItem('admin_failed_attempts');
            localStorage.removeItem('admin_block_time');
            clearInterval(countdownInterval);
          } else {
            setBlockTimeRemaining(timeLeft);
          }
        }, 1000);
      } else {
        // Block time has expired, clean up
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_block_time');
        setFailedAttempts(0);
      }
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
      const [profileData, expData, eduData, skillsData, venturesData, achData, papersData, aptData, analyticsData, statusData] = await Promise.all([
        API.getProfile().catch(() => null),
        API.getExperience(),
        API.getEducation(),
        API.getSkills(),
        API.getVentures(),
        API.getAchievements(),
        API.getWhitePapers(),
        API.getAppointments(),
        API.getAnalytics(),
        API.getSystemStatus().catch(() => null)
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
      setSystemStatus(statusData);
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
          
          {/* Security Status */}
          {isBlocked && (
            <div className="mb-4 p-3 bg-red-500/20 border border-primary-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">
                🚫 Login blocked for {Math.ceil(blockTimeRemaining / 60000)} minutes
              </p>
            </div>
          )}
          
          {failedAttempts > 0 && !isBlocked && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ {failedAttempts}/3 failed attempts. {3 - failedAttempts} remaining.
              </p>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    isBlocked 
                      ? 'border-primary-500/50 focus:border-primary-500/50 focus:ring-red-500/25' 
                      : 'border-white/20 focus:border-blue-500/50 focus:ring-blue-500/25'
                  }`}
                  placeholder="Enter admin password"
                  disabled={isBlocked}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isBlocked}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isBlocked}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                isBlocked
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
            >
              {isBlocked ? '🔒 Blocked' : 'Login'}
            </button>
          </form>
          
          {/* Return to Portfolio Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Portfolio
            </button>
            <p className="text-gray-400 text-sm mt-2">Go back to the main portfolio page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-primary-600/80 to-primary-700/80 backdrop-blur-md border border-primary-500/50 rounded-xl flex items-center justify-center shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all"
        aria-label="Toggle Sidebar"
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - Fixed with scrollable navigation */}
      <div className={`w-64 bg-black/50 backdrop-blur-md border-r border-white/10 flex flex-col fixed left-0 top-0 bottom-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header - Fixed */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            📊 Admin Dashboard
          </h1>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'status', label: 'System Status', icon: '🔍' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'experience', label: 'Experience', icon: '💼' },
            { id: 'education', label: 'Education', icon: '🎓' },
            { id: 'skills', label: 'Skills', icon: '🛠' },
            { id: 'ventures', label: 'Ventures', icon: '🚀' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'whitepapers', label: 'White Papers', icon: '📄' },
            { id: 'appointments', label: 'Appointments', icon: '📅' },
            { id: 'theme', label: 'Theme', icon: '🎨' },
            { id: 'envvars', label: 'Environment Variables', icon: '⚙️' },
            { id: 'aiinstructions', label: 'AI Instructions', icon: '🤖' },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-left ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>

        {/* Footer Actions - Fixed */}
        <div className="p-4 border-t border-white/10 space-y-2 flex-shrink-0">
          <a 
            href="/portfolio" 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            View Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-primary-400 hover:bg-red-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content - With left margin for fixed sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 ml-0">
        {/* Top Bar - Fixed */}
        <div className="bg-black/30 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4 fixed top-0 right-0 left-0 lg:left-64 z-30">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold capitalize pl-14 lg:pl-0">
              {activeSection === 'whitepapers' ? 'White Papers' : activeSection}
            </h2>
            <div className="hidden sm:block text-sm text-gray-400">
              Welcome to the admin dashboard
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-in slide-in-from-right`}>
            {message.text}
          </div>
        )}

        {/* Content Area - Scrollable with top padding for fixed header */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto mt-[73px]">

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">{activeSection === 'overview' && (
                <OverviewSection analytics={analytics} data={{ profile, experience, education, skills, ventures, achievements, whitePapers, appointments }} />
              )}
              {activeSection === 'status' && (
                <SystemStatusSection 
                  systemStatus={systemStatus}
                  loadAllData={loadAllData}
                  showMessage={showMessage}
                />
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
              {activeSection === 'theme' && (
                <ThemeSection 
                  showMessage={showMessage}
                />
              )}
              {activeSection === 'envvars' && (
                <EnvironmentVariablesSection 
                  envVars={envVars}
                  setEnvVars={setEnvVars}
                  showMessage={showMessage}
                />
              )}
              {activeSection === 'aiinstructions' && (
                <AIInstructionsSection 
                  aiInstructions={aiInstructions}
                  setAiInstructions={setAiInstructions}
                  showMessage={showMessage}
                />
              )}
            </div>
          )}
        </div>
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
    red: 'from-red-500/20 to-red-600/20 border-primary-500/30 text-red-400',
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

// Edit Modal - Fully functional forms for all sections
const EditModal = ({ section, item, onClose, onSave }) => {
  const [formData, setFormData] = useState(item || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Set default values for new items
      const defaults = getDefaultValues(section);
      setFormData(defaults);
    }
  }, [item, section]);

  const getDefaultValues = (section) => {
    switch (section) {
      case 'experience':
        return {
          role: '',
          company: '',
          period: '',
          location: '',
          description: [''],
          projects: [{ name: '', description: '' }]
        };
      case 'education':
        return {
          degree: '',
          institution: '',
          period: '',
          location: '',
          field: '',
          details: ['']
        };
      case 'skills':
        return {
          category: '',
          skills: [{ name: '', level: 50 }]
        };
      case 'ventures':
        return {
          name: '',
          role: '',
          period: '',
          type: '',
          description: '',
          achievements: [''],
          technologies: ['']
        };
      case 'whitepapers':
        return {
          title: '',
          briefDescription: '',
          fullDescription: '',
          keyPoints: [''],
          publishedDate: '',
          pages: '',
          category: ''
        };
      case 'achievements':
        return {
          certificates: [{ name: '', issuer: '', year: '', description: '' }],
          hackathons: [{ event: '', year: '', description: '' }]
        };
      case 'appointments':
        return { status: 'pending' };
      default:
        return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderForm = () => {
    switch (section) {
      case 'experience':
        return renderExperienceForm();
      case 'education':
        return renderEducationForm();
      case 'skills':
        return renderSkillsForm();
      case 'ventures':
        return renderVenturesForm();
      case 'whitepapers':
        return renderWhitePapersForm();
      case 'achievements':
        return renderAchievementsForm();
      case 'appointments':
        return renderAppointmentsForm();
      default:
        return <div className="text-gray-400">Form not implemented for {section}</div>;
    }
  };

  const renderExperienceForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Role *</label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Company *</label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Period</label>
          <input
            type="text"
            value={formData.period || ''}
            onChange={(e) => handleChange('period', e.target.value)}
            placeholder="e.g., 2020 - Present"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        {(formData.description || ['']).map((desc, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={desc}
              onChange={(e) => handleArrayChange('description', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-20"
              placeholder="Job responsibility or achievement"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('description', index)}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('description', '')}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Description
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Projects</label>
        {(formData.projects || [{ name: '', description: '' }]).map((project, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg mb-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Project {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeArrayItem('projects', index)}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={project.name || ''}
              onChange={(e) => handleArrayChange('projects', index, { ...project, name: e.target.value })}
              placeholder="Project name"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white mb-2"
            />
            <textarea
              value={project.description || ''}
              onChange={(e) => handleArrayChange('projects', index, { ...project, description: e.target.value })}
              placeholder="Project description"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white h-16"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('projects', { name: '', description: '' })}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Project
        </button>
      </div>
    </div>
  );

  const renderEducationForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Degree *</label>
          <input
            type="text"
            value={formData.degree || ''}
            onChange={(e) => handleChange('degree', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Institution *</label>
          <input
            type="text"
            value={formData.institution || ''}
            onChange={(e) => handleChange('institution', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Period</label>
          <input
            type="text"
            value={formData.period || ''}
            onChange={(e) => handleChange('period', e.target.value)}
            placeholder="e.g., 2018 - 2022"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Field of Study</label>
          <input
            type="text"
            value={formData.field || ''}
            onChange={(e) => handleChange('field', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Details</label>
        {(formData.details || ['']).map((detail, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={detail}
              onChange={(e) => handleArrayChange('details', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-20"
              placeholder="Achievement, coursework, or relevant detail"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('details', index)}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('details', '')}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Detail
        </button>
      </div>
    </div>
  );

  const renderSkillsForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Category *</label>
        <input
          type="text"
          value={formData.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="e.g., Backend Development, Frontend Development"
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Skills</label>
        {(formData.skills || [{ name: '', level: 50 }]).map((skill, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg mb-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Skill {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeArrayItem('skills', index)}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={skill.name || ''}
                onChange={(e) => handleArrayChange('skills', index, { ...skill, name: e.target.value })}
                placeholder="Skill name"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
              <div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level || 50}
                  onChange={(e) => handleArrayChange('skills', index, { ...skill, level: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-400">{skill.level || 50}%</div>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('skills', { name: '', level: 50 })}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Skill
        </button>
      </div>
    </div>
  );

  const renderVenturesForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            value={formData.role || ''}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Period</label>
          <input
            type="text"
            value={formData.period || ''}
            onChange={(e) => handleChange('period', e.target.value)}
            placeholder="e.g., 2023 - Present"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            value={formData.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="">Select type</option>
            <option value="Startup">Startup</option>
            <option value="Freelance">Freelance</option>
            <option value="Open Source">Open Source</option>
            <option value="Personal Project">Personal Project</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-24"
          placeholder="Describe the venture or project"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Achievements</label>
        {(formData.achievements || ['']).map((achievement, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={achievement}
              onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-16"
              placeholder="Key achievement or milestone"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('achievements', index)}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('achievements', '')}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Achievement
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Technologies</label>
        {(formData.technologies || ['']).map((tech, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={tech}
              onChange={(e) => handleArrayChange('technologies', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Technology or tool used"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('technologies', index)}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('technologies', '')}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Technology
        </button>
      </div>
    </div>
  );

  const renderWhitePapersForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Brief Description</label>
        <textarea
          value={formData.briefDescription || ''}
          onChange={(e) => handleChange('briefDescription', e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-20"
          placeholder="Short summary for the card view"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Description</label>
        <textarea
          value={formData.fullDescription || ''}
          onChange={(e) => handleChange('fullDescription', e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-32"
          placeholder="Detailed description for the popup"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Published Date</label>
          <input
            type="text"
            value={formData.publishedDate || ''}
            onChange={(e) => handleChange('publishedDate', e.target.value)}
            placeholder="e.g., March 2024"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Pages</label>
          <input
            type="text"
            value={formData.pages || ''}
            onChange={(e) => handleChange('pages', e.target.value)}
            placeholder="e.g., 12 pages"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g., AI Research"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Key Points</label>
        {(formData.keyPoints || ['']).map((point, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={point}
              onChange={(e) => handleArrayChange('keyPoints', index, e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-16"
              placeholder="Key point or finding"
            />
            <button
              type="button"
              onClick={() => removeArrayItem('keyPoints', index)}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('keyPoints', '')}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Key Point
        </button>
      </div>
    </div>
  );

  const renderAchievementsForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-4">🏆 Certificates</h3>
        {(formData.certificates || [{ name: '', issuer: '', year: '', description: '' }]).map((cert, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Certificate {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeArrayItem('certificates', index)}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                value={cert.name || ''}
                onChange={(e) => handleArrayChange('certificates', index, { ...cert, name: e.target.value })}
                placeholder="Certificate name"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
              <input
                type="text"
                value={cert.issuer || ''}
                onChange={(e) => handleArrayChange('certificates', index, { ...cert, issuer: e.target.value })}
                placeholder="Issuing organization"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                value={cert.year || ''}
                onChange={(e) => handleArrayChange('certificates', index, { ...cert, year: e.target.value })}
                placeholder="Year"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
              <textarea
                value={cert.description || ''}
                onChange={(e) => handleArrayChange('certificates', index, { ...cert, description: e.target.value })}
                placeholder="Description (optional)"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white h-20"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('certificates', { name: '', issuer: '', year: '', description: '' })}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Certificate
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">🏅 Hackathons</h3>
        {(formData.hackathons || [{ event: '', year: '', description: '' }]).map((hack, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Hackathon {index + 1}</h4>
              <button
                type="button"
                onClick={() => removeArrayItem('hackathons', index)}
                className="px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <input
                type="text"
                value={hack.event || ''}
                onChange={(e) => handleArrayChange('hackathons', index, { ...hack, event: e.target.value })}
                placeholder="Event name"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
              <input
                type="text"
                value={hack.year || ''}
                onChange={(e) => handleArrayChange('hackathons', index, { ...hack, year: e.target.value })}
                placeholder="Year"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
              />
            </div>
            <textarea
              value={hack.description || ''}
              onChange={(e) => handleArrayChange('hackathons', index, { ...hack, description: e.target.value })}
              placeholder="Achievement or project description"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white h-20"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('hackathons', { event: '', year: '', description: '' })}
          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30"
        >
          + Add Hackathon
        </button>
      </div>
    </div>
  );

  const renderAppointmentsForm = () => (
    <div className="space-y-4">
      <div className="bg-white/5 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Appointment Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-gray-400">Name:</span>
            <div className="font-medium">{formData.name}</div>
          </div>
          <div>
            <span className="text-gray-400">Email:</span>
            <div className="font-medium">{formData.email}</div>
          </div>
          <div>
            <span className="text-gray-400">Date:</span>
            <div className="font-medium">{formData.date}</div>
          </div>
          <div>
            <span className="text-gray-400">Time:</span>
            <div className="font-medium">{formData.time}</div>
          </div>
        </div>
        <div className="mb-4">
          <span className="text-gray-400">Reason:</span>
          <div className="font-medium mt-1">{formData.reason}</div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <select
          value={formData.status || 'pending'}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold capitalize">
            {item ? 'Edit' : 'Add'} {section === 'whitepapers' ? 'White Paper' : section}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className="mt-8 flex gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                saving 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
              } text-white`}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Environment Variables Section
const EnvironmentVariablesSection = ({ envVars, setEnvVars, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedVars, setEditedVars] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEnvVars();
  }, []);

  const loadEnvVars = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/env-variables');
      if (response.ok) {
        const data = await response.json();
        setEnvVars(data);
        setEditedVars(data);
      }
    } catch (error) {
      console.error('Error loading environment variables:', error);
      showMessage('Error loading environment variables', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/env-variables', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedVars),
      });
      
      if (response.ok) {
        setEnvVars(editedVars);
        setIsEditing(false);
        showMessage('Environment variables updated successfully!');
      } else {
        showMessage('Error updating environment variables', 'error');
      }
    } catch (error) {
      console.error('Error saving environment variables:', error);
      showMessage('Error saving environment variables', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedVars(envVars);
    setIsEditing(false);
  };

  const handleChange = (key, value) => {
    setEditedVars(prev => ({ ...prev, [key]: value }));
  };

  const handleAddNew = () => {
    const key = prompt('Enter new environment variable name:');
    if (key && key.trim()) {
      setEditedVars(prev => ({ ...prev, [key.trim()]: '' }));
      setIsEditing(true);
    }
  };

  const handleDelete = (key) => {
    if (window.confirm(`Are you sure you want to delete ${key}?`)) {
      setEditedVars(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      setIsEditing(true);
    }
  };

  if (loading && Object.keys(envVars).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading environment variables...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">⚙️ Environment Variables</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
              >
                + Add New
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {Object.keys(editedVars).length > 0 ? (
            Object.entries(editedVars).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-400 mb-2">{key}</label>
                  {isEditing ? (
                    <input
                      type={key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') || key.toLowerCase().includes('key') ? 'password' : 'text'}
                      value={value || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      placeholder={`Enter ${key}`}
                    />
                  ) : (
                    <div className="px-4 py-2 bg-white/10 rounded-lg text-white font-mono text-sm">
                      {key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') || key.toLowerCase().includes('key') 
                        ? '••••••••••••••••' 
                        : value || '(not set)'}
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => handleDelete(key)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No environment variables configured.</p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
              >
                Add First Variable
              </button>
            </div>
          )}
        </div>

        {Object.keys(editedVars).length > 0 && (
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Warning:</strong> Changing environment variables may require a server restart to take effect. 
              Be careful when editing sensitive values like API keys and secrets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Theme Section
const ThemeSection = ({ showMessage }) => {
  const [theme, setTheme] = useState({
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    accentColor: '#991b1b'
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/theme`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setTheme({
            primaryColor: data.primary_color || '#ef4444',
            secondaryColor: data.secondary_color || '#dc2626',
            accentColor: data.accent_color || '#991b1b'
          });
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (colorType, value) => {
    setTheme(prev => ({ ...prev, [colorType]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: theme.primaryColor,
          secondary_color: theme.secondaryColor,
          accent_color: theme.accentColor
        }),
      });
      
      if (response.ok) {
        showMessage('Theme colors updated successfully! Reloading page...');
        setHasChanges(false);
        // Reload the page to apply new theme
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showMessage('Error updating theme', 'error');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      showMessage('Error saving theme', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTheme({
      primaryColor: '#ef4444',
      secondaryColor: '#dc2626',
      accentColor: '#991b1b'
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎨 Theme Customization</h2>
          <p className="text-gray-400 mt-1">Customize your portfolio color scheme</p>
        </div>
      </div>

      {loading && !theme ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12">
          <p className="text-gray-400">Loading theme...</p>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 space-y-6">
          {/* Primary Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Primary Color
              <span className="text-gray-500 text-xs ml-2">Main brand color (buttons, accents)</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-20 h-12 rounded-lg cursor-pointer border-2 border-white/20"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="#ef4444"
              />
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Secondary Color
              <span className="text-gray-500 text-xs ml-2">Hover states, highlights</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-20 h-12 rounded-lg cursor-pointer border-2 border-white/20"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="#dc2626"
              />
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: theme.secondaryColor }}
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Accent Color
              <span className="text-gray-500 text-xs ml-2">Borders, shadows, gradients</span>
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                value={theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-20 h-12 rounded-lg cursor-pointer border-2 border-white/20"
              />
              <input
                type="text"
                value={theme.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="#991b1b"
              />
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 p-6 rounded-lg border-2 border-white/10 bg-black/30">
            <h3 className="text-lg font-semibold mb-4 text-white">Preview</h3>
            <div className="space-y-3">
              <button 
                className="px-6 py-2 rounded-lg font-medium transition-all"
                style={{ 
                  backgroundColor: theme.primaryColor,
                  color: 'white'
                }}
              >
                Primary Button
              </button>
              <button 
                className="px-6 py-2 rounded-lg font-medium transition-all"
                style={{ 
                  backgroundColor: theme.secondaryColor,
                  color: 'white'
                }}
              >
                Secondary Button
              </button>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  borderColor: theme.accentColor,
                  borderWidth: '2px',
                  backgroundColor: `${theme.accentColor}20`
                }}
              >
                <p className="text-white">Accent color border and background</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {loading ? 'Saving...' : 'Save Theme'}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all"
            >
              Reset to Default
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm">
              💡 <strong>Tip:</strong> Changes will be applied immediately after saving. You may need to refresh the page to see the full effect across all components.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// AI Instructions Section
const AIInstructionsSection = ({ aiInstructions, setAiInstructions, showMessage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAIInstructions();
  }, []);

  const loadAIInstructions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-instructions');
      if (response.ok) {
        const data = await response.json();
        const instructions = data.instructions || '';
        setAiInstructions(instructions);
        setEditedInstructions(instructions);
      }
    } catch (error) {
      console.error('Error loading AI instructions:', error);
      showMessage('Error loading AI instructions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-instructions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions: editedInstructions }),
      });
      
      if (response.ok) {
        setAiInstructions(editedInstructions);
        setIsEditing(false);
        showMessage('AI instructions updated successfully!');
      } else {
        showMessage('Error updating AI instructions', 'error');
      }
    } catch (error) {
      console.error('Error saving AI instructions:', error);
      showMessage('Error saving AI instructions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedInstructions(aiInstructions);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default instructions?')) {
      const defaultInstructions = `You are Ibrahim El Khalil's AI assistant, helping visitors learn about his portfolio and capabilities.

Key Guidelines:
- Be professional, friendly, and helpful
- Provide accurate information about Ibrahim's experience, skills, and projects
- Guide users to relevant sections of the portfolio
- Answer questions about his work, education, and achievements
- If you don't know something, be honest and suggest contacting Ibrahim directly

Remember to maintain a conversational tone while being informative and respectful.`;
      setEditedInstructions(defaultInstructions);
      setIsEditing(true);
    }
  };

  if (loading && !aiInstructions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AI instructions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🤖 AI Chat Instructions</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
              >
                Reset to Default
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <div className="mb-4">
          <p className="text-gray-400 text-sm">
            These instructions guide the AI chatbot's behavior and responses. Customize them to control how the AI represents you and interacts with visitors.
          </p>
        </div>

        {isEditing ? (
          <textarea
            value={editedInstructions}
            onChange={(e) => setEditedInstructions(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm"
            rows={20}
            placeholder="Enter system instructions for the AI chatbot..."
          />
        ) : (
          <div className="px-4 py-3 bg-white/10 rounded-lg text-white font-mono text-sm whitespace-pre-wrap min-h-[400px]">
            {aiInstructions || '(No instructions set. Click Edit to add instructions.)'}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            💡 <strong>Tip:</strong> Include specific information about your expertise, personality traits, and how you want the AI to guide visitors through your portfolio. The more detailed, the better the AI will represent you.
          </p>
        </div>
      </div>
    </div>
  );
};

// System Status Section
const SystemStatusSection = ({ systemStatus, loadAllData, showMessage }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadAllData();
      showMessage('System status refreshed successfully!');
    } catch (error) {
      showMessage('Error refreshing system status', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'degraded': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'error': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'warning': return '⚠️';
      case 'degraded': return '🟡';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  if (!systemStatus) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔍 System Status</h2>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
          >
            {refreshing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading system status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">🔍 System Status</h2>
          <p className="text-gray-400 mt-1">Monitor database connection and system health</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2"
        >
          {refreshing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {refreshing ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Overall Status */}
      <div className={`mb-6 p-4 rounded-xl border ${getStatusColor(systemStatus.overall_status)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getStatusIcon(systemStatus.overall_status)}</span>
            <div>
              <h3 className="text-lg font-bold">Overall System Status</h3>
              <p className="text-sm opacity-75 capitalize">{systemStatus.overall_status}</p>
            </div>
          </div>
          <div className="text-right text-sm opacity-75">
            <p>Last checked:</p>
            <p>{new Date(systemStatus.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Status */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">🗄️</span>
            Database Connection
            <span className={`px-2 py-1 rounded-full text-xs ${systemStatus.database.connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {systemStatus.database.connected ? 'Connected' : 'Disconnected'}
            </span>
          </h3>
          
          {systemStatus.database.connected ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mb-3">Collection Status:</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(systemStatus.database.collections || {}).map(([collection, info]) => (
                  <div key={collection} className="bg-white/5 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium capitalize">{collection}</span>
                      <span className="text-xs bg-blue-500/30 text-blue-400 px-2 py-1 rounded-full">
                        {info.count}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {info.last_modified ? (
                        <>Modified: {new Date(info.last_modified).toLocaleDateString()}</>
                      ) : (
                        'No timestamp'
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-red-400 bg-red-500/10 p-3 rounded-lg">
              <p className="font-medium">Connection Failed</p>
              <p className="text-sm opacity-75">{systemStatus.database.error || 'Unknown error'}</p>
            </div>
          )}
        </div>

        {/* Backend Status */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            Backend Service
            <span className={`px-2 py-1 rounded-full text-xs ${systemStatus.backend?.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {systemStatus.backend?.status || 'Unknown'}
            </span>
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version:</span>
                <span>{systemStatus.backend?.version || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Port:</span>
                <span>{systemStatus.backend?.environment?.port || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span>{systemStatus.backend?.uptime || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-gray-400 mb-2">Environment Configuration:</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Gemini API Key</span>
                <span className={`px-2 py-1 rounded-full text-xs ${systemStatus.backend?.environment?.has_gemini_api ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {systemStatus.backend?.environment?.has_gemini_api ? '✓ Configured' : '✗ Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>MongoDB URI</span>
                <span className={`px-2 py-1 rounded-full text-xs ${systemStatus.backend?.environment?.has_mongo_uri ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {systemStatus.backend?.environment?.has_mongo_uri ? '✓ Configured' : '✗ Missing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Status */}
      <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">🔗</span>
          API Endpoints
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{systemStatus.api_endpoints?.total_endpoints || 0}</div>
            <div className="text-sm text-gray-400">Total Endpoints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{systemStatus.api_endpoints?.public_endpoints || 0}</div>
            <div className="text-sm text-gray-400">Public Endpoints</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{systemStatus.api_endpoints?.authenticated_endpoints || 0}</div>
            <div className="text-sm text-gray-400">Admin Endpoints</div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="mt-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-xl">📊</span>
          System Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Database Collections Summary</h4>
            <div className="text-sm space-y-1">
              {systemStatus.database.collections && Object.entries(systemStatus.database.collections).map(([name, info]) => (
                <div key={name} className="flex justify-between">
                  <span className="capitalize">{name}:</span>
                  <span className="text-blue-400">{info.count} documents</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Recent Activity</h4>
            <div className="text-sm space-y-1 text-gray-400">
              <div>• System last checked at {new Date(systemStatus.timestamp).toLocaleString()}</div>
              <div>• Database connection: {systemStatus.database.connected ? 'Active' : 'Failed'}</div>
              <div>• Backend service: {systemStatus.backend?.status || 'Unknown'}</div>
              {systemStatus.error && (
                <div className="text-red-400">• Error: {systemStatus.error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
