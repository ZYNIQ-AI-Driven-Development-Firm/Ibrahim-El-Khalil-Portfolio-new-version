import React, { useState, useEffect } from 'react';
import { OTHER_ACHIEVEMENTS_DATA } from '../constants';
import * as API from '../services/apiService';

const OtherAchievements = () => {
  const [achievementsData, setAchievementsData] = useState(OTHER_ACHIEVEMENTS_DATA);
  const [loading, setLoading] = useState(true);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [showAllHackathons, setShowAllHackathons] = useState(false);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const achievements = await API.getAchievements();
        if (achievements) {
          setAchievementsData(achievements);
        }
      } catch (error) {
        console.error('Error loading achievements:', error);
        // Fallback to constants if API fails
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Other Achievements</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-5 animate-pulse">
              <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 animate-pulse">
              <div className="h-6 bg-white/10 rounded mb-4 w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const certificatesData = achievementsData.certificates || [];
  const hackathonsData = achievementsData.hackathons || [];
  return (
    <section className="py-12">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Other Achievements</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates Column */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Certificates ({certificatesData.length})
                </h3>
                {certificatesData.length > 2 && (
                  <button
                    onClick={() => setShowAllCertificates(!showAllCertificates)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showAllCertificates ? '← less' : 'more →'}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {(showAllCertificates ? certificatesData : certificatesData.slice(0, 2)).map((cert, index) => (
                  <div key={index} className="border-l-2 border-blue-500/30 pl-4 py-2">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-semibold text-white">{cert.name}</h4>
                      <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                        {cert.year}
                      </span>
                    </div>
                    <p className="text-sm text-blue-400 mb-1">{cert.issuer}</p>
                    {cert.description && (
                      <p className="text-xs text-gray-300 leading-relaxed">{cert.description}</p>
                    )}
                  </div>
                ))}
                {!showAllCertificates && certificatesData.length > 2 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-400">
                      +{certificatesData.length - 2} more certificates
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hackathons Column */}
          <div className="glass-card rounded-xl p-5 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Hackathons ({hackathonsData.length})
                </h3>
                {hackathonsData.length > 2 && (
                  <button
                    onClick={() => setShowAllHackathons(!showAllHackathons)}
                    className="text-sm text-green-400 hover:text-green-300 transition-colors"
                  >
                    {showAllHackathons ? '← less' : 'more →'}
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {(showAllHackathons ? hackathonsData : hackathonsData.slice(0, 2)).map((hack, index) => {
                  // Extract placement indicators and clean event name
                  const placementRegex = /(🥇|🥈|🥉|\(1st Place\)|\(2nd Place\)|\(3rd Place\)|Technical Mentor)/g;
                  const placements = hack.event.match(placementRegex) || [];
                  const cleanEventName = hack.event.replace(placementRegex, '').trim();
                  
                  return (
                    <div key={index} className="border-l-2 border-green-500/30 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-white mb-1">{cleanEventName}</h4>
                          {placements.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {placements.map((placement, pIndex) => (
                                <span 
                                  key={pIndex} 
                                  className="text-xs font-medium text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full"
                                >
                                  {placement}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full ml-2">
                          {hack.year}
                        </span>
                      </div>
                      {hack.description && (
                        <p className="text-sm text-gray-300 leading-relaxed mt-2">{hack.description}</p>
                      )}
                    </div>
                  );
                })}
                {!showAllHackathons && hackathonsData.length > 2 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-400">
                      +{hackathonsData.length - 2} more hackathons
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtherAchievements;
