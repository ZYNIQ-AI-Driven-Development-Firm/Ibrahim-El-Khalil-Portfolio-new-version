import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Ventures from './components/Ventures';
import OtherAchievements from './components/OtherAchievements';
import AiChat from './components/AiChat';
import AppointmentManager from './components/AppointmentManager';
import AdminDashboard from './components/AdminDashboard';

const loadingSteps = [
    "Initializing Interface...",
    "Compiling Work Experience...",
    "Analyzing Skills & Expertise...",
    "Building Ventures & Education...",
    "Finalizing..."
];

const App = () => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Track visit analytics
    import('./services/apiService').then(({ trackEvent }) => {
      trackEvent('visit');
    });

    const interval = setInterval(() => {
        setLoadingStep(prev => {
            const next = prev + 1;
            if (next >= loadingSteps.length) {
                clearInterval(interval);
                // Wait a bit before fading out the loader
                setTimeout(() => setLoading(false), 500);
                return prev; // Don't increment beyond array bounds
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
              seg.classList.add('visible');
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
    <Router>
      <div>
        <Routes>
          <Route path="/admin-0v7h7g7v0k9d6a8" element={<AdminDashboard />} />
          <Route path="/" element={
            <>
              {/* Loading Screen */}
              {/* Main Portfolio */}
              <main className="relative z-10 container mx-auto px-4 md:px-6 py-8 max-w-6xl">
                <Hero />
                <div className="space-y-12 mt-12">
                  <Experience />
                  <Ventures />
                  <Education />
                  <OtherAchievements />
                </div>
                <footer className="text-center pt-12 pb-6 text-sm text-slate-400">
                    © 2025 IEK Portfolio By ZYNIQ. All rights reserved.
                </footer>
              </main>
              <AiChat />
              <AppointmentManager />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;