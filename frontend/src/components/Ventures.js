import React from 'react';
import { VENTURES_DATA } from '../constants';

const Ventures = () => {
  return (
    <section className="py-16">
      <div className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Ventures & Projects</h2>
        
        <div className="space-y-8">
          {VENTURES_DATA.map((venture, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-2">{venture.name}</h3>
                    <h4 className="text-xl text-red-400 mb-2">{venture.role}</h4>
                    <p className="text-gray-300 leading-relaxed">{venture.description}</p>
                  </div>
                  <div className="flex lg:justify-end">
                    <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                      <p className="text-white font-medium">{venture.period}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Key Achievements:</h5>
                  <div className="space-y-2">
                    {venture.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 leading-relaxed">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold text-white mb-3">Technologies:</h5>
                  <div className="flex flex-wrap gap-2">
                    {venture.technologies.map((tech, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ventures;