import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Ventures from './components/Ventures';
import AiChat from './components/AiChat';

const loadingSteps = [
    "Booting up...",
    "Compiling Work Experience...",
    "Analyzing Skills & Expertise...",
    "Loading Ventures & Education...",
    "Finalizing Interface..."
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setLoadingStep(prev => {
            const next = prev + 1;
            if (next >= loadingSteps.length) {
                clearInterval(interval);
                // Wait a bit before fading out the loader
                setTimeout(() => setLoading(false), 500);
            }
            return next;
        });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loader = document.getElementById('loader');
    const appContainer = document.getElementById('app-container');
    const loadingTextEl = document.getElementById('loading-text');

    if (loading) {
      // Handle progress bar segments
      document.querySelectorAll('.progress-segment').forEach((seg, index) => {
          if (index < loadingStep) {
              (seg as HTMLElement).classList.add('visible');
          }
      });
      
      // Handle cycling text with fade effect
      if (loadingTextEl && loadingSteps[loadingStep]) {
        // Fade out before changing text
        loadingTextEl.style.opacity = '0';
        
        // Wait for fade-out to finish, then update text and fade in
        setTimeout(() => {
            loadingTextEl.textContent = loadingSteps[loadingStep];
            loadingTextEl.style.opacity = '1';
        }, 300);
      }

    } else {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
        if (appContainer) {
            appContainer.classList.add('loaded');
        }
    }
  }, [loading, loadingStep]);
  
  return (
    <div>
      <main className="relative z-10 container mx-auto px-4 md:px-8 py-12">
        <Hero />
        <div className="space-y-16 mt-16">
          <Experience />
          <Ventures />
          <Skills />
          <Education />
        </div>
      </main>
      <AiChat />
    </div>
  );
};

export default App;
