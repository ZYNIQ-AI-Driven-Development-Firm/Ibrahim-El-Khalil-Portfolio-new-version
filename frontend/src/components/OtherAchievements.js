import React from 'react';
import { OTHER_ACHIEVEMENTS_DATA } from '../constants';

const OtherAchievements = () => {
  return (
    <section className="py-12">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Other Achievements</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates Column */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Certificates
              </h3>
              <div className="space-y-4">
                {OTHER_ACHIEVEMENTS_DATA.certificates.map((cert, index) => (
                  <div key={index} className="border-l-2 border-blue-500/30 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-semibold text-white">{cert.name}</h4>
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-sm text-blue-400 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{cert.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hackathons Column */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Hackathons
              </h3>
              <div className="space-y-3">
                {OTHER_ACHIEVEMENTS_DATA.hackathons.map((hack, index) => (
                  <div key={index} className="border-l-2 border-green-500/30 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-semibold text-white">{hack.event}</h4>
                      <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                        {hack.year}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{hack.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherAchievements;