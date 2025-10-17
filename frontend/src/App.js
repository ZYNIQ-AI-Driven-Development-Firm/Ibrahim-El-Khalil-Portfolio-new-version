import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Ventures from './components/Ventures';
import OtherAchievements from './components/OtherAchievements';
import Blog from './components/Blog';
import AiChat from './components/AiChat';
import AppointmentManager from './components/AppointmentManager';
import AdminDashboard from './components/AdminDashboard';
import BusinessCardPage from './components/BusinessCardPage';
import * as API from './services/apiService';

const loadingSteps = [
    "Initializing Interface...",
    "Compiling Work Experience...",
    "Analyzing Skills & Expertise...",
    "Building Ventures & Education...",
    "Finalizing..."
];

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Portfolio component with loading logic
const PortfolioPage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load theme colors on mount (non-blocking)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await API.getTheme();
        if (theme) {
          // Convert hex colors to RGB for CSS variables
          const primary = hexToRgb(theme.primary_color || '#ef4444');
          const secondary = hexToRgb(theme.secondary_color || '#dc2626');
          const accent = hexToRgb(theme.accent_color || '#991b1b');
          const header = hexToRgb(theme.header_color || theme.primary_color || '#ef4444');

          if (primary && secondary && accent && header) {
            // Set CSS variables on root
            document.documentElement.style.setProperty('--color-primary', `${primary.r} ${primary.g} ${primary.b}`);
            document.documentElement.style.setProperty('--color-secondary', `${secondary.r} ${secondary.g} ${secondary.b}`);
            document.documentElement.style.setProperty('--color-accent', `${accent.r} ${accent.g} ${accent.b}`);
            document.documentElement.style.setProperty('--color-header', `${header.r} ${header.g} ${header.b}`);
            
            // Set background colors (darker shades of primary)
            const bgStart = {
              r: Math.max(0, Math.floor(primary.r * 0.06)),
              g: Math.max(0, Math.floor(primary.g * 0.06)),
              b: Math.max(0, Math.floor(primary.b * 0.15))
            };
            const bgEnd = {
              r: Math.max(0, Math.floor(primary.r * 0.10)),
              g: Math.max(0, Math.floor(primary.g * 0.10)),
              b: Math.max(0, Math.floor(primary.b * 0.18))
            };
            
            document.documentElement.style.setProperty('--bg-start', `${bgStart.r} ${bgStart.g} ${bgStart.b}`);
            document.documentElement.style.setProperty('--bg-end', `${bgEnd.r} ${bgEnd.g} ${bgEnd.b}`);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Use default red theme - already set in CSS
      }
    };

    // Load theme in background, don't wait for it
    loadTheme().catch(err => console.error('Theme loading failed:', err));
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false); // Close mobile menu after navigation
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'ventures', 'experience', 'education', 'blog', 'achievements'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Show loader for portfolio page
    const loader = document.getElementById('loader');
    const appContainer = document.getElementById('app-container');
    if (loader) {
      loader.style.display = 'flex';
    }
    if (appContainer) {
      appContainer.classList.remove('loaded');
    }

    // Track visit analytics
    import('./services/apiService').then(({ trackEvent }) => {
      trackEvent('visit');
    });

    const interval = setInterval(() => {
        setLoadingStep(prev => {
            const next = prev + 1;
            if (next >= loadingSteps.length) {
                clearInterval(interval);
                // Wait a bit before hiding loader
                setTimeout(() => {
                  setLoading(false);
                }, 500);
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
    <>
      {/* Loading Screen */}
      
      {/* Section Indicators - Transparent Connected Dots on Left Side (All Devices) */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-0">
        {/* Connecting Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10"></div>
        
        {[
          { id: 'hero', label: 'Home' },
          { id: 'ventures', label: 'Ventures' },
          { id: 'experience', label: 'Experience' },
          { id: 'education', label: 'Education' },
          { id: 'achievements', label: 'Achievements' }
        ].map((item, index) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className="relative group my-2"
            aria-label={item.label}
          >
            {/* Transparent Dot */}
            <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === item.id
                ? 'bg-red-500 border-red-500 scale-125'
                : 'bg-transparent border-white/20 hover:border-white/40'
            }`}>
            </div>
            
            {/* Tooltip on hover */}
            <span className="absolute left-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      {/* Main Portfolio */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-8 pt-20 lg:pt-8 max-w-6xl">
        <div id="hero">
          <Hero />
        </div>
        <div className="space-y-8 sm:space-y-12 mt-8 sm:mt-12">
          <div id="ventures">
            <Ventures />
          </div>
          <div id="experience">
            <Experience />
          </div>
          <div id="education">
            <Education />
          </div>
          <div id="blog">
            <Blog />
          </div>
          <div id="achievements">
            <OtherAchievements />
          </div>
        </div>
        <footer className="text-center pt-12 pb-6 text-sm text-slate-400">
            © 2025 IEK Portfolio By ZYNIQ. All rights reserved.
        </footer>
      </main>
      <AiChat />
      <AppointmentManager />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BusinessCardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;