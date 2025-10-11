import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../constants';
import { SearchIcon } from './icons';

const SkillsPopup = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    if (!searchTerm.trim()) {
      return SKILLS_DATA;
    }

    return SKILLS_DATA.map(category => ({
      ...category,
      skills: category.skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.skills.length > 0);
  }, [searchTerm]);

  // Get proficiency level label
  const getProficiencyLabel = (level) => {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Advanced';
    if (level >= 70) return 'Proficient';
    if (level >= 60) return 'Intermediate';
    return 'Beginner';
  };

  // Get proficiency color
  const getProficiencyColor = (level) => {
    if (level >= 90) return 'from-green-500 to-emerald-600';
    if (level >= 80) return 'from-blue-500 to-cyan-600';
    if (level >= 70) return 'from-purple-500 to-indigo-600';
    if (level >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
  };

  // Get skill icon based on skill name
  const getSkillIcon = (skillName) => {
    const icons = {
      // Backend
      'Python': '🐍',
      'Django': '🎸',
      'FastAPI': '⚡',
      'Flask': '🧪',
      'Node.js': '🟢',
      // Databases
      'PostgreSQL': '🐘',
      'MongoDB': '🍃',
      'Redis': '🔴',
      'MySQL': '🐬',
      'DynamoDB': '📊',
      // Cloud & DevOps
      'AWS': '☁️',
      'Docker': '🐳',
      'Kubernetes': '☸️',
      'GCP': '🌩️',
      'CI/CD': '🔄',
      // AI & ML
      'Machine Learning': '🤖',
      'TensorFlow': '🧠',
      'PyTorch': '🔥',
      'NLP': '💬',
      'Computer Vision': '👁️'
    };
    return icons[skillName] || '⚙️';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-md border-b border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <span className="text-2xl">💼</span>
                Skills & Technologies
              </h2>
              <p className="text-gray-400 text-sm mt-1">Technical expertise and proficiency levels</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills or technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-400">
              Found {filteredSkills.reduce((total, category) => total + category.skills.length, 0)} skills
              {filteredSkills.length !== SKILLS_DATA.length && ` in ${filteredSkills.length} categories`}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {filteredSkills.length > 0 ? (
            <div className="space-y-8">
              {filteredSkills.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <h3 className="text-xl font-bold text-white px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                      {category.category}
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.skills.map((skill, skillIndex) => {
                      const proficiencyLabel = getProficiencyLabel(skill.level);
                      const proficiencyColor = getProficiencyColor(skill.level);
                      const icon = getSkillIcon(skill.name);

                      return (
                        <div
                          key={skillIndex}
                          className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                        >
                          {/* Skill Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                                {icon}
                              </div>
                              <div>
                                <h4 className="text-white font-semibold text-lg">{skill.name}</h4>
                                <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r ${proficiencyColor} rounded-full`}>
                                  {proficiencyLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Proficiency Bar */}
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Proficiency</span>
                              <span className="text-xs font-semibold text-white">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r ${proficiencyColor} rounded-full transition-all duration-1000 ease-out relative`}
                                style={{ width: `${skill.level}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="flex flex-col items-center justify-center py-16">
              <SearchIcon className="h-16 w-16 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-2">No skills found for "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors duration-200"
              >
                Clear search and show all skills
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-md border-t border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">
            Total: <span className="text-white font-semibold">{SKILLS_DATA.reduce((total, cat) => total + cat.skills.length, 0)}</span> skills across <span className="text-white font-semibold">{SKILLS_DATA.length}</span> categories
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsPopup;
