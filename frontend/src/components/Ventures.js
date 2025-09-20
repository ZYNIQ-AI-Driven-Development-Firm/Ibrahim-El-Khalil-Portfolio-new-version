import React, { useState } from 'react';
import { VENTURES_DATA, WHITE_PAPERS_DATA } from '../constants';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

const Ventures = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPaperSlide, setCurrentPaperSlide] = useState(0);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % VENTURES_DATA.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + VENTURES_DATA.length) % VENTURES_DATA.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextPaperSlide = () => {
    setCurrentPaperSlide((prev) => (prev + 1) % WHITE_PAPERS_DATA.length);
  };

  const prevPaperSlide = () => {
    setCurrentPaperSlide((prev) => (prev - 1 + WHITE_PAPERS_DATA.length) % WHITE_PAPERS_DATA.length);
  };

  const openPaperModal = (paper) => {
    setSelectedPaper(paper);
  };

  const closePaperModal = () => {
    setSelectedPaper(null);
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
              <div key={index} className="w-full flex-shrink-0">
                <div className="glass-card rounded-xl p-5 relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-3">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{venture.name}</h3>
                          {venture.type && (
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
                              {venture.type}
                            </span>
                          )}
                        </div>
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
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="flex justify-center mt-4">
            <div className="text-sm text-gray-400">
              {currentSlide + 1} of {VENTURES_DATA.length}
            </div>
          </div>
        </div>

        {/* White Papers Section */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold text-white">White Papers / Publications</h3>
            
            {/* Paper Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {WHITE_PAPERS_DATA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPaperSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentPaperSlide 
                        ? 'bg-blue-500 w-4' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={prevPaperSlide}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                >
                  <ChevronLeftIcon className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={nextPaperSlide}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                >
                  <ChevronRightIcon className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Papers Slider */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPaperSlide * 100}%)` }}
            >
              {WHITE_PAPERS_DATA.map((paper, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div 
                    onClick={() => openPaperModal(paper)}
                    className="glass-card rounded-lg p-4 cursor-pointer hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-white">{paper.title}</h4>
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30">
                            {paper.category}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-2">{paper.briefDescription}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>📅 {paper.publishedDate}</span>
                          <span>📄 {paper.pages}</span>
                        </div>
                      </div>
                      <div className="ml-4 text-blue-400 hover:text-blue-300">
                        <span className="text-sm">Read →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* White Paper Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-card rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedPaper.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {selectedPaper.category}
                  </span>
                  <span>📅 {selectedPaper.publishedDate}</span>
                  <span>📄 {selectedPaper.pages}</span>
                </div>
              </div>
              <button
                onClick={closePaperModal}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <CloseIcon className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Abstract</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{selectedPaper.fullDescription}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Key Points</h3>
                <div className="space-y-2">
                  {selectedPaper.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <button
                  onClick={closePaperModal}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Ventures;