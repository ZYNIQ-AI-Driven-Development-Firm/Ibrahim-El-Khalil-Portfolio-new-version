import React, { useState, useEffect } from 'react';
import { EDUCATION_DATA } from '../constants';
import * as API from '../services/apiService';

const Education = () => {
  const [education, setEducation] = useState(EDUCATION_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const data = await API.getEducation();
        if (data && data.length > 0) {
          setEducation(data);
        }
      } catch (error) {
        console.error('Error loading education:', error);
        // Fallback to constants if API fails
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Education</h2>
          <div className="glass-card rounded-xl p-5">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Education</h2>
        
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className="glass-card rounded-xl p-5 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{edu.degree}</h3>
                    <h4 className="text-lg text-primary-400 mb-1">{edu.institution}</h4>
                    {edu.field && <p className="text-sm text-orange-400 mb-1">{edu.field}</p>}
                    {edu.location && <p className="text-gray-400 text-sm">{edu.location}</p>}
                  </div>
                  
                  {edu.details && Array.isArray(edu.details) && edu.details.length > 0 && (
                    <div className="space-y-2">
                      {edu.details.map((detail, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 leading-relaxed text-sm">{detail}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex lg:justify-end">
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10 h-fit">
                    <p className="text-white text-sm font-medium">{edu.period}</p>
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

export default Education;
