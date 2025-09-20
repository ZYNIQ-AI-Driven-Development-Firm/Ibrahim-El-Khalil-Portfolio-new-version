import React from 'react';
import { EDUCATION_DATA } from '../constants';

const Education = () => {
  return (
    <section className="py-16">
      <div className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">Education</h2>
        
        <div className="space-y-8">
          {EDUCATION_DATA.map((edu, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{edu.degree}</h3>
                    <h4 className="text-xl text-red-400 mb-1">{edu.institution}</h4>
                    {edu.location && <p className="text-gray-400 text-sm">{edu.location}</p>}
                  </div>
                  
                  <div className="space-y-3">
                    {edu.details.map((detail, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 leading-relaxed">{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex lg:justify-end">
                  <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                    <p className="text-white font-medium">{edu.period}</p>
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