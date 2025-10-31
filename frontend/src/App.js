import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Education from './components/Education';
import Ventures from './components/Ventures';
import OtherAchievements from './components/OtherAchievements';
import Blog from './components/Blog';
import BlogPage from './components/BlogPage';
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
  const [sectionVisibility, setSectionVisibility] = useState([]);
  const [visibleSections, setVisibleSections] = useState([]);

  // Load theme colors and section visibility on mount
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

    const loadSectionVisibility = async () => {
      try {
        const sections = await API.getSectionVisibility();
        if (sections && sections.length > 0) {
          setSectionVisibility(sections);
          // Create ordered list of visible sections
          const visible = sections
            .filter(section => section.is_visible)
            .sort((a, b) => a.display_order - b.display_order)
            .map(section => section.section_name);
          setVisibleSections(visible);
          
          // Set first visible section as active
          if (visible.length > 0) {
            setActiveSection(visible[0]);
          }
        } else {
          // Default to all sections visible if none configured
          const defaultSections = ['hero', 'ventures', 'experience', 'education', 'achievements', 'blog'];
          setVisibleSections(defaultSections);
          setActiveSection('hero');
        }
      } catch (error) {
        console.error('Error loading section visibility:', error);
        // Default to all sections visible on error
        const defaultSections = ['hero', 'ventures', 'experience', 'education', 'achievements', 'blog'];
        setVisibleSections(defaultSections);
        setActiveSection('hero');
      }
    };

    // Load theme and section visibility in background
    Promise.all([
      loadTheme().catch(err => console.error('Theme loading failed:', err)),
      loadSectionVisibility().catch(err => console.error('Section visibility loading failed:', err))
    ]);
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

  // Track active section on scroll (only for visible sections)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of visibleSections) {
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

    if (visibleSections.length > 0) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [visibleSections]);

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
      {visibleSections.length > 0 && (
        <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-0">
          {/* Connecting Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10"></div>
          
          {visibleSections.map((sectionId) => {
            const sectionLabels = {
              'hero': 'Home',
              'ventures': 'Ventures',
              'experience': 'Experience',
              'education': 'Education',
              'achievements': 'Achievements',
              'blog': 'Blog & Insights'
            };
            
            return (
              <button
                key={sectionId}
                onClick={() => scrollToSection(sectionId)}
                className="relative group my-2"
                aria-label={sectionLabels[sectionId]}
              >
                {/* Transparent Dot */}
                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  activeSection === sectionId
                    ? 'bg-red-500 border-red-500 scale-125'
                    : 'bg-transparent border-white/20 hover:border-white/40'
                }`}>
                </div>
                
                {/* Tooltip on hover */}
                <span className="absolute left-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {sectionLabels[sectionId]}
                </span>
              </button>
            );
          })}
        </nav>
      )}
      
      {/* Main Portfolio */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-8 pt-20 lg:pt-8 max-w-6xl">
        {/* Render sections based on visibility settings in order */}
        {visibleSections.map((sectionId, index) => {
          const renderSection = () => {
            switch (sectionId) {
              case 'hero':
                return <Hero />;
              case 'ventures':
                return <Ventures />;
              case 'experience':
                return <Experience />;
              case 'education':
                return <Education />;
              case 'achievements':
                return <OtherAchievements />;
              case 'blog':
                return <Blog />;
              default:
                return null;
            }
          };

          return (
            <div key={sectionId} id={sectionId} className={index === 0 ? '' : 'mt-8 sm:mt-12'}>
              {renderSection()}
            </div>
          );
        })}
        
        {/* Show message if no sections are visible */}
        {visibleSections.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Portfolio Under Maintenance</h2>
              <p className="text-gray-400">The portfolio sections are currently being updated. Please check back later.</p>
            </div>
          </div>
        )}
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
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;