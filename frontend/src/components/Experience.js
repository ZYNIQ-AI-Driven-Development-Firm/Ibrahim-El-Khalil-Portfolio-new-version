import React from 'react';
import { EXPERIENCE_DATA } from '../constants';

const Experience = () => {
  return (
    <section className="py-12">
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Work Experience</h2>
        
        <div className="space-y-6">
          {EXPERIENCE_DATA.map((job, index) => (
            <div key={index} className="glass-card rounded-xl p-5 md:p-6 relative overflow-hidden">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{job.role}</h3>
                      <h4 className="text-lg text-red-400">{job.company}</h4>
                      {job.location && <p className="text-gray-400 text-sm">{job.location}</p>}
                    </div>
                    <div className="sm:hidden lg:hidden bg-white/5 p-2 rounded-lg text-center border border-white/10">
                      <p className="text-white text-sm font-medium">{job.period}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {job.description.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-300 leading-relaxed text-sm">{item}</p>
                      </div>
                    ))}
                    {job.description.length > 2 && (
                      <details className="group cursor-pointer">
                        <summary className="text-red-400 hover:text-red-300 text-sm font-medium">
                          Show more...
                        </summary>
                        <div className="mt-2 space-y-2">
                          {job.description.slice(2).map((item, i) => (
                            <div key={i + 2} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-300 leading-relaxed text-sm">{item}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
                
                <div className="hidden sm:flex lg:flex justify-end">
                  <div className="bg-white/5 p-3 rounded-lg text-center border border-white/10 h-fit">
                    <p className="text-white text-sm font-medium">{job.period}</p>
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

export default Experience;