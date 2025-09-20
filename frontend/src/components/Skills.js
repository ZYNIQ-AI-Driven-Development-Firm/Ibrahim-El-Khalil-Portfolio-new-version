import React from 'react';
import { SKILLS_DATA } from '../constants';

const Skills = () => {
  return (
    <section className="py-12">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Skills & Technologies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILLS_DATA.map((category, index) => (
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
      </div>
    </section>
  );
};

export default Skills;