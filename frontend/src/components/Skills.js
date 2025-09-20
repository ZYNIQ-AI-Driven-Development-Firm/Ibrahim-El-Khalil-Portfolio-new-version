import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../constants';
import { SearchIcon } from './icons';

const Skills = () => {
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

  return (
    <section className="py-12">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Skills & Technologies</h2>
          
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/25 transition-all duration-200 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Skills Count */}
        {searchTerm && (
          <div className="text-sm text-gray-400">
            Found {filteredSkills.reduce((total, category) => total + category.skills.length, 0)} skills
            {filteredSkills.length !== SKILLS_DATA.length && ` in ${filteredSkills.length} categories`}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSkills.map((category, index) => (
            <div key={index} className="glass-card rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4">{category.category}</h3>
                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300 font-medium text-sm">{skill.name}</span>
                        <span className="text-red-400 text-xs font-medium">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {searchTerm && filteredSkills.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <SearchIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No skills found for "{searchTerm}"</p>
            </div>
            <button
              onClick={() => setSearchTerm('')}
              className="text-red-400 hover:text-red-300 text-sm underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;