import React, { useState, useMemo } from 'react';
import { SKILLS_DATA } from '../constants';
import { SearchIcon } from './icons';

const Skills: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSkills = useMemo(() => {
    if (!searchTerm) {
      return SKILLS_DATA;
    }
    return SKILLS_DATA.map(category => ({
      ...category,
      skills: category.skills.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(category => category.skills.length > 0);
  }, [searchTerm]);

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-center md:text-left mb-4 md:mb-0">Skills & Expertise</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#EA2323] text-white"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((category, index) => (
            <div key={index} className="p-6 rounded-lg glass-card">
              <h3 className="text-xl font-bold text-slate-200 mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-slate-700/80 text-slate-200 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 text-center text-gray-400 py-8">
            <p>No skills found for "{searchTerm}".</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;