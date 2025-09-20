import React, { useState, useEffect } from 'react';
import { 
  PROFILE_DATA, 
  EXPERIENCE_DATA, 
  EDUCATION_DATA, 
  SKILLS_DATA, 
  VENTURES_DATA, 
  WHITE_PAPERS_DATA, 
  OTHER_ACHIEVEMENTS_DATA 
} from '../constants';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [editingData, setEditingData] = useState({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Simple authentication (in production, use proper auth)
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Invalid password!');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('admin_authenticated');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
  };

  // AI Assistant for content generation
  const handleAiAssist = async () => {
    setIsAiLoading(true);
    try {
      // Mock AI response - in real implementation, you'd call your AI service
      const mockResponses = {
        'generate experience': 'Here\'s a sample experience entry:\n\nRole: Senior Full Stack Developer\nCompany: Tech Innovations Inc.\nPeriod: 2023 - Present\nDescription: Led development of scalable web applications using React and Node.js...',
        'create skill': 'New skill suggestion:\n\nSkill: TypeScript\nLevel: 90\nCategory: Frontend Development\nDescription: Advanced TypeScript development with complex type systems...',
        'write bio': 'Professional bio suggestion:\n\nExperienced software engineer with 8+ years in full-stack development, specializing in modern web technologies and AI integration...'
      };
      
      const response = mockResponses[aiPrompt.toLowerCase()] || 
        `AI Assistant: I can help you with:\n\n• Generating professional descriptions\n• Creating skill entries\n• Writing compelling bios\n• Optimizing content for impact\n\nTry asking: "generate experience" or "create skill"`;
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      setAiResponse(response);
    } catch (error) {
      setAiResponse('AI Assistant temporarily unavailable. Please try again later.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Data update functions
  const updateProfileData = (field, value) => {
    // In production, this would make API calls to update the backend
    console.log('Updating profile:', field, value);
  };

  const addNewSection = (sectionType) => {
    // Logic to add new portfolio sections
    console.log('Adding new section:', sectionType);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="glass-card rounded-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/25"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg font-medium transition-all duration-200"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="glass-card rounded-none border-x-0 border-t-0 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Portfolio Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">Welcome, Ibrahim</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 glass-card rounded-none border-y-0 border-l-0 min-h-screen p-4">
          <nav className="space-y-2">
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' },
              { id: 'profile', label: '👤 Profile', icon: '👤' },
              { id: 'experience', label: '💼 Experience', icon: '💼' },
              { id: 'skills', label: '🎯 Skills', icon: '🎯' },
              { id: 'education', label: '🎓 Education', icon: '🎓' },
              { id: 'ventures', label: '🚀 Ventures', icon: '🚀' },
              { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
              { id: 'ai-assistant', label: '🤖 AI Assistant', icon: '🤖' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'hover:bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label.split(' ').slice(1).join(' ')}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
              
              {/* Analytics Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Analytics Dashboard
                </h3>
                
                {/* Top Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="glass-card rounded-xl p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Total Visitors</h4>
                        <p className="text-3xl font-bold text-green-400">12,847</p>
                        <p className="text-sm text-gray-400">+18.2% from last month</p>
                      </div>
                      <div className="text-green-400">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Page Views</h4>
                        <p className="text-3xl font-bold text-blue-400">89,653</p>
                        <p className="text-sm text-gray-400">+24.7% from last month</p>
                      </div>
                      <div className="text-blue-400">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-4 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">AI Interactions</h4>
                        <p className="text-3xl font-bold text-purple-400">2,394</p>
                        <p className="text-sm text-gray-400">+31.5% from last month</p>
                      </div>
                      <div className="text-purple-400">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-xl p-4 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold mb-1">Appointments</h4>
                        <p className="text-3xl font-bold text-orange-400">47</p>
                        <p className="text-sm text-gray-400">+12 this week</p>
                      </div>
                      <div className="text-orange-400">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Real-time Analytics */}
                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-4 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      Real-time Analytics
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Active visitors now</span>
                        <span className="text-2xl font-bold text-green-400">23</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Pages viewed (last hour)</span>
                        <span className="text-xl font-semibold text-blue-400">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">AI chats initiated</span>
                        <span className="text-xl font-semibold text-purple-400">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">New appointments</span>
                        <span className="text-xl font-semibold text-orange-400">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Analytics */}
                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-4">🌍 Geographic Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">🇺🇸</span>
                          <span className="text-gray-300">United States</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                          <span className="text-sm text-blue-400">68%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">🇦🇪</span>
                          <span className="text-gray-300">UAE</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <span className="text-sm text-green-400">15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">🇬🇧</span>
                          <span className="text-gray-300">United Kingdom</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                          </div>
                          <span className="text-sm text-purple-400">12%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">🌍</span>
                          <span className="text-gray-300">Others</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-700 rounded-full h-2 mr-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                          </div>
                          <span className="text-sm text-orange-400">5%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-4">🔥 Most Viewed Sections</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Work Experience', views: 8942, percentage: 85 },
                        { name: 'Skills & Technologies', views: 7834, percentage: 74 },
                        { name: 'Ventures & Projects', views: 6723, percentage: 64 },
                        { name: 'AI Chat Interactions', views: 5612, percentage: 53 },
                        { name: 'White Papers', views: 4387, percentage: 42 }
                      ].map((section, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-300">{section.name}</span>
                            <p className="text-sm text-gray-500">{section.views.toLocaleString()} views</p>
                          </div>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                                style={{ width: `${section.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-red-400">{section.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-xl p-6">
                    <h4 className="text-xl font-semibold mb-4">📱 Device & Browser Stats</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Device Types</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">💻 Desktop</span>
                            <span className="text-blue-400">58.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">📱 Mobile</span>
                            <span className="text-green-400">32.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">📊 Tablet</span>
                            <span className="text-purple-400">9.7%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Top Browsers</p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Chrome</span>
                            <span className="text-blue-400">67.4%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Safari</span>
                            <span className="text-green-400">18.9%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Firefox</span>
                            <span className="text-purple-400">8.2%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Edge</span>
                            <span className="text-orange-400">5.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Content Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Experience</h3>
                  <p className="text-2xl font-bold text-blue-400">{EXPERIENCE_DATA.length}</p>
                  <p className="text-sm text-gray-400">Job positions</p>
                </div>
                
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <p className="text-2xl font-bold text-green-400">
                    {SKILLS_DATA.reduce((total, category) => total + category.skills.length, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Technologies</p>
                </div>
                
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Ventures</h3>
                  <p className="text-2xl font-bold text-purple-400">{VENTURES_DATA.length}</p>
                  <p className="text-sm text-gray-400">Active projects</p>
                </div>
                
                <div className="glass-card rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-2">Publications</h3>
                  <p className="text-2xl font-bold text-orange-400">{WHITE_PAPERS_DATA.length}</p>
                  <p className="text-sm text-gray-400">White papers</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Portfolio updated successfully</span>
                    <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">New appointment booking received</span>
                    <span className="text-xs text-gray-400 ml-auto">5 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">AI chat interaction completed</span>
                    <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Profile Management</h2>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={PROFILE_DATA.name}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      onChange={(e) => updateProfileData('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      defaultValue={PROFILE_DATA.title}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      onChange={(e) => updateProfileData('title', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Bio/Summary</label>
                  <textarea
                    defaultValue={PROFILE_DATA.summary}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white h-32"
                    onChange={(e) => updateProfileData('summary', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* AI Assistant Section */}
          {activeSection === 'ai-assistant' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">AI Assistant</h2>
              
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Content Generation Assistant</h3>
                <p className="text-gray-300 mb-4">
                  Use AI to help generate content for your portfolio sections.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ask AI Assistant</label>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., 'generate experience', 'create skill', 'write bio'"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <button
                    onClick={handleAiAssist}
                    disabled={isAiLoading || !aiPrompt.trim()}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    {isAiLoading ? 'Generating...' : 'Ask AI'}
                  </button>
                  
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                      <h4 className="font-semibold mb-2">AI Response:</h4>
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">{aiResponse}</pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <h4 className="font-semibold mb-3">Quick Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Generate Bio',
                      'Create Skill',
                      'Write Experience',
                      'Add Achievement',
                      'Optimize Content',
                      'SEO Suggestions'
                    ].map((action) => (
                      <button
                        key={action}
                        onClick={() => setAiPrompt(action.toLowerCase())}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors duration-200"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections would be implemented similarly */}
          {activeSection !== 'overview' && activeSection !== 'profile' && activeSection !== 'ai-assistant' && (
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-3xl font-bold mb-6">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
              </h2>
              <p className="text-gray-300">
                This section is under development. You can manage {activeSection} data here.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;