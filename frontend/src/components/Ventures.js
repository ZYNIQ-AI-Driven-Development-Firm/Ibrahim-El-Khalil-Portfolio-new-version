import React, { useState } from 'react';
import { VENTURES_DATA } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const Ventures = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % VENTURES_DATA.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + VENTURES_DATA.length) % VENTURES_DATA.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ventures & Projects</h2>
          
          {/* Slide Navigation */}
          <div className="flex items-center space-x-4">
            {/* Slide Indicators */}
            <div className="flex space-x-2">
              {VENTURES_DATA.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-red-500 w-6' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105"
                aria-label="Previous venture"
              >
                <ChevronLeftIcon className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105"
                aria-label="Next venture"
              >
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide Container */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {VENTURES_DATA.map((venture, index) => (
            <div key={index} className="glass-card rounded-xl p-5 relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3">
                    <h3 className="text-xl font-bold text-white mb-1">{venture.name}</h3>
                    <h4 className="text-lg text-red-400 mb-2">{venture.role}</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">{venture.description}</p>
                  </div>
                  <div className="flex lg:justify-end">
                    <div className="bg-white/5 p-2 rounded-lg text-center border border-white/10 h-fit">
                      <p className="text-white text-sm font-medium">{venture.period}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-base font-semibold text-white mb-2">Key Achievements:</h5>
                    <div className="space-y-1">
                      {venture.achievements.slice(0, 2).map((achievement, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 leading-relaxed text-sm">{achievement}</p>
                        </div>
                      ))}
                      {venture.achievements.length > 2 && (
                        <details className="group cursor-pointer">
                          <summary className="text-red-400 hover:text-red-300 text-sm font-medium">
                            +{venture.achievements.length - 2} more...
                          </summary>
                          <div className="mt-1 space-y-1">
                            {venture.achievements.slice(2).map((achievement, i) => (
                              <div key={i + 2} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-gray-300 leading-relaxed text-sm">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-base font-semibold text-white mb-2">Technologies:</h5>
                    <div className="flex flex-wrap gap-1">
                      {venture.technologies.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-red-500/20 text-red-300 rounded-md text-xs border border-red-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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