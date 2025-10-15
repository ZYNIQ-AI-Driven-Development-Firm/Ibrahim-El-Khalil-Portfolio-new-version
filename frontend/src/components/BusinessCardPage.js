import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PROFILE_DATA, SOCIAL_LINKS } from '../constants';
import * as API from '../services/apiService';

const BusinessCardPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGlow, setShowGlow] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    ...PROFILE_DATA,
    linkedin: SOCIAL_LINKS.linkedin,
    github: SOCIAL_LINKS.github,
    email: SOCIAL_LINKS.email,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await API.getProfile();
        if (profile) {
          setProfileData({
            ...profile,
            linkedin: profile.linkedin || SOCIAL_LINKS.linkedin,
            github: profile.github || SOCIAL_LINKS.github,
            email: profile.email || SOCIAL_LINKS.email,
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to constants
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const cardRef = useRef(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // final offset requested by user; read from localStorage if present (desktop only)
  const initialOffset = (() => {
    try {
      const v = localStorage.getItem('businessCardOffset');
      return v ? JSON.parse(v) : { x: -290, y: -190 };
    } catch { return { x: -290, y: -190 }; }
  })();
  const [offset, setOffset] = useState(initialOffset);

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        setCardSize({ width: Math.round(r.width), height: Math.round(r.height) });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // persist chosen offset so it remains after reload
  useEffect(() => {
    try { localStorage.setItem('businessCardOffset', JSON.stringify(offset)); } catch (e) {}
  }, [offset]);

  useEffect(() => {
    // Subtle glow animation
    const glowInterval = setInterval(() => {
      setShowGlow(prev => !prev);
    }, 3000);
    return () => clearInterval(glowInterval);
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleEnterPortfolio = () => {
    navigate('/portfolio');
  };

  return (
    <div 
      className="fixed flex items-center justify-center w-screen h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 50%, #000000 100%)',
        zIndex: 1
      }}
    >
      {/* Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.1"/>
              <stop offset="50%" stopColor="#64748b" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.1"/>
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.08"/>
              <stop offset="50%" stopColor="#475569" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#475569" stopOpacity="0.08"/>
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.06"/>
              <stop offset="50%" stopColor="#334155" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#334155" stopOpacity="0.06"/>
            </linearGradient>
          </defs>
          
          {/* Wave Layer 1 */}
          <path d="M0,400 C300,350 600,450 900,400 C1000,380 1100,420 1200,400 L1200,800 L0,800 Z" fill="url(#waveGradient1)">
            <animate attributeName="d" 
              values="M0,400 C300,350 600,450 900,400 C1000,380 1100,420 1200,400 L1200,800 L0,800 Z;
                      M0,420 C300,370 600,470 900,420 C1000,400 1100,440 1200,420 L1200,800 L0,800 Z;
                      M0,400 C300,350 600,450 900,400 C1000,380 1100,420 1200,400 L1200,800 L0,800 Z"
              dur="8s" repeatCount="indefinite"/>
          </path>
          
          {/* Wave Layer 2 */}
          <path d="M0,450 C250,400 500,500 750,450 C850,430 950,470 1200,450 L1200,800 L0,800 Z" fill="url(#waveGradient2)">
            <animate attributeName="d" 
              values="M0,450 C250,400 500,500 750,450 C850,430 950,470 1200,450 L1200,800 L0,800 Z;
                      M0,470 C250,420 500,520 750,470 C850,450 950,490 1200,470 L1200,800 L0,800 Z;
                      M0,450 C250,400 500,500 750,450 C850,430 950,470 1200,450 L1200,800 L0,800 Z"
              dur="12s" repeatCount="indefinite"/>
          </path>
          
          {/* Wave Layer 3 */}
          <path d="M0,500 C400,460 800,540 1200,500 L1200,800 L0,800 Z" fill="url(#waveGradient3)">
            <animate attributeName="d" 
              values="M0,500 C400,460 800,540 1200,500 L1200,800 L0,800 Z;
                      M0,520 C400,480 800,560 1200,520 L1200,800 L0,800 Z;
                      M0,500 C400,460 800,540 1200,500 L1200,800 L0,800 Z"
              dur="15s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
      
      {/* Floating Wave Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-slate-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Floating Glow Elements */}
      <motion.div
        className="absolute w-64 h-64 bg-primary-500/15 rounded-full blur-3xl pointer-events-none"
        style={{ top: '20%', right: '20%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-primary-700/15 rounded-full blur-3xl pointer-events-none"
        style={{ bottom: '20%', left: '20%' }}
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.5, 0.2, 0.5],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, delay: 3 }}
      />
      
      {/* Radial Lines Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <radialGradient id="radialLines">
              <stop offset="0%" stopColor="#ff0000" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${50 + Math.cos(angle) * 100}%`}
                y2={`${50 + Math.sin(angle) * 100}%`}
                stroke="url(#radialLines)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </div>

      {/* Card Container */}
      <div
        style={{
          perspective: '2000px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* wrapper to apply pixel offsets for positioning - centered on all devices */}
        <div ref={cardRef}>
        {/* 3D Card */}
        <motion.div
          initial={{ scale: 0.5, rotateY: -180, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            type: 'spring', 
            stiffness: 50,
            delay: 0.3 
          }}
          style={{
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
          }}
          onClick={handleCardClick}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            style={{
              transformStyle: 'preserve-3d',
              position: 'relative',
            }}
            whileHover={{ scale: isMobile ? 1 : 1.05 }}
          >
            {/* Front of Card */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div
                className="rounded-3xl overflow-hidden flex items-center justify-center"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(600px, 95vw)',
                  height: 'min(360px, 90vh)',
                  maxHeight: '700px',
                  background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 50%, rgb(0, 0, 0) 100%)',
                  boxShadow: showGlow
                    ? 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(100, 116, 139, 0.15) 0px 0px 80px'
                    : 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(100, 116, 139, 0.1) 0px 0px 80px',
                  transition: 'box-shadow 3s ease-in-out',
                }}
              >
                {/* Card Border Glow */}
                <div className="absolute inset-0 rounded-3xl border-2 border-slate-500/20" />
                
                {/* Subtle Pattern */}
                <div className="absolute inset-0 opacity-3">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.3"/>
                      </pattern>
                      <linearGradient id="subtleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#64748b" stopOpacity="0.1"/>
                        <stop offset="50%" stopColor="#64748b" stopOpacity="0.05"/>
                        <stop offset="100%" stopColor="#64748b" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#subtleGradient)" />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="relative h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                  {/* Top Section - Badge-style Profile Picture on Mobile */}
                  <div className={`${isMobile ? 'flex flex-col items-center' : 'flex items-start justify-between gap-2'}`}>
                    {/* Profile Image with 3D Effect - Badge Style on Mobile */}
                    <motion.div
                      className={`relative flex-shrink-0 ${isMobile ? '-mt-2 mb-2' : ''}`}
                      whileHover={{ scale: isMobile ? 1 : 1.1, rotateZ: isMobile ? 0 : 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <div className={`${isMobile ? 'w-20 h-20' : 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'} rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-primary-500/50 shadow-2xl ${isMobile ? '' : 'transform rotate-3'}`}>
                        <img
                          src={profileData.image}
                          alt={profileData.name}
                          className={`w-full h-full ${isMobile ? 'object-contain' : 'object-cover'}`}
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-gray-900 animate-pulse" />
                    </motion.div>

                    {/* Logo/Brand - Centered on Mobile */}
                    <div className={`${isMobile ? 'text-center' : 'text-right'} flex-shrink-0`}>
                      <motion.div
                        initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
                        style={{ fontFamily: 'Orbitron, sans-serif' }}
                      >
                        BUSINESS CARD
                      </motion.div>
                      <div className="text-[10px] sm:text-xs text-primary-400 mt-1">Digital Presence</div>
                    </div>
                  </div>

                  {/* Middle Section - Name & Title */}
                  <div className="space-y-1 sm:space-y-2 my-2 sm:my-0">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
                      style={{ 
                        fontFamily: 'Orbitron, sans-serif',
                        textShadow: '0 0 30px rgba(255, 0, 0, 0.5)'
                      }}
                    >
                      {profileData.name}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="text-xs sm:text-sm md:text-base lg:text-lg text-primary-300 font-medium"
                    >
                      {profileData.title}
                    </motion.p>
                  </div>

                  {/* Bottom Section - Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-primary-500/30"
                  >
                    <div className="flex flex-col gap-1.5 sm:gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="truncate">contact@khalilpreview.space</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>+971585774519</span>
                      </div>
                    </div>
                    
                    {/* Hover to flip indicator */}
                    <div className="text-[10px] sm:text-xs text-primary-400 opacity-70 animate-pulse self-end sm:self-auto">
                      {isMobile ? 'Tap to flip →' : 'Click to flip →'}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div
                className="rounded-3xl overflow-hidden flex items-center justify-center"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'min(600px, 90vw)',
                  height: 'min(340px, 50vh)',
                  background: 'linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(15, 23, 42) 50%, rgb(0, 0, 0) 100%)',
                  boxShadow: 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(100, 116, 139, 0.1) 0px 0px 80px',
                }}
              >
                {/* Card Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-slate-500/20" />
                
                {/* Back Content */}
                <div className="relative h-full p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Let's Connect
                    </h2>
                    
                    {/* Contact Links in flexible grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <a
                        href="tel:+971585774519"
                        className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-primary-400 transition-colors group p-2 sm:p-0"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors flex-shrink-0">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm">+971 585 774 519</span>
                      </a>
                      
                      {profileData.linkedin && (
                        <a
                          href={profileData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-primary-400 transition-colors group p-2 sm:p-0"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm">LinkedIn</span>
                        </a>
                      )}
                      
                      {profileData.github && (
                        <a
                          href={profileData.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 sm:gap-3 text-gray-300 hover:text-primary-400 transition-colors group p-2 sm:p-0"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </div>
                          <span className="text-xs sm:text-sm">GitHub</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Bottom with flip back indicator */}
                  <div className="flex items-end justify-end pt-3 sm:pt-4 border-t border-primary-500/30">
                    <div className="text-[10px] sm:text-xs text-primary-400 opacity-70 animate-pulse">
                      ← {isMobile ? 'Tap to flip back' : 'Click to flip back'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>

      {/* UI Layer - Buttons and text */}
      <div 
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        style={{ zIndex: 20 }}
      >
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          onClick={handleEnterPortfolio}
          className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-full shadow-2xl transition-all duration-300 text-sm sm:text-base"
          style={{ 
            fontFamily: 'Orbitron, sans-serif'
          }}
          whileHover={{ scale: isMobile ? 1 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center gap-2 sm:gap-3">
            Enter Portfolio
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </motion.button>
      </div>

      {/* Debug controls removed — final offset applied */}

      {/* Hint Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute top-8 left-1/2 text-center"
        style={{ 
          transform: 'translateX(-50%)',
          zIndex: 20
        }}
      >
        <p className="text-gray-400 text-sm">Click the card to see contact information</p>
      </motion.div>
    </div>
  );
};

export default BusinessCardPage;

