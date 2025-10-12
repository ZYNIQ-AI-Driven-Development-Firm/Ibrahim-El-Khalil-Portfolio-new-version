import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessCardModal = ({ isOpen, onClose, profileData }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGlow, setShowGlow] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Subtle glow animation
      const glowInterval = setInterval(() => {
        setShowGlow(prev => !prev);
      }, 3000);
      return () => clearInterval(glowInterval);
    }
  }, [isOpen]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  if (!profileData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #330000 100%)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Card Container with Perspective */}
          <div className="relative flex items-center justify-center" style={{ perspective: '2000px' }}>
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
              className="relative"
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
                whileHover={{ scale: 1.05 }}
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
                    className="relative w-[600px] h-[340px] rounded-3xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #1a0000 0%, #330000 50%, #000000 100%)',
                      boxShadow: showGlow 
                        ? '0 30px 60px rgba(255, 0, 0, 0.4), 0 0 80px rgba(255, 0, 0, 0.3)'
                        : '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(255, 0, 0, 0.1)',
                      transition: 'box-shadow 3s ease-in-out',
                    }}
                  >
                    {/* Card Border Glow */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-red-500/40" />
                    
                    {/* Animated Circuit Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <svg width="100%" height="100%">
                        <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                          <path d="M10 10 L90 10 L90 90 L10 90 Z" stroke="#ff0000" strokeWidth="0.5" fill="none" />
                          <circle cx="10" cy="10" r="2" fill="#ff0000" />
                          <circle cx="90" cy="90" r="2" fill="#ff0000" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#circuit)" />
                      </svg>
                    </div>

                    {/* Card Content */}
                    <div className="relative h-full p-10 flex flex-col justify-between">
                      {/* Top Section */}
                      <div className="flex items-start justify-between">
                        {/* Profile Image with 3D Effect */}
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1, rotateZ: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-red-500/50 shadow-2xl transform rotate-3">
                            <img
                              src={profileData.image}
                              alt={profileData.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse" />
                        </motion.div>

                        {/* Logo/Brand */}
                        <div className="text-right">
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                          >
                            PORTFOLIO
                          </motion.div>
                          <div className="text-xs text-red-400 mt-1">Digital Presence</div>
                        </div>
                      </div>

                      {/* Middle Section - Name & Title */}
                      <div className="space-y-2">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="text-4xl font-bold text-white"
                          style={{ 
                            fontFamily: 'Orbitron, sans-serif',
                            textShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
                          }}
                        >
                          {profileData.name}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 }}
                          className="text-lg text-blue-300 font-medium"
                        >
                          {profileData.title}
                        </motion.p>
                      </div>

                      {/* Bottom Section - Contact Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="flex items-center justify-between pt-4 border-t border-blue-500/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {profileData.location}
                          </div>
                        </div>
                        
                        {/* Hover to flip indicator */}
                        <div className="text-xs text-blue-400 opacity-70 animate-pulse">
                          Click to flip →
                        </div>
                      </motion.div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full" />
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
                    className="relative w-[600px] h-[340px] rounded-3xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {/* Card Border */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-cyan-500/30" />
                    
                    {/* Back Content */}
                    <div className="relative h-full p-10 flex flex-col justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                          Let's Connect
                        </h2>
                        
                        {/* Contact Links */}
                        <div className="space-y-4">
                          {profileData.email && (
                            <a
                              href={`mailto:${profileData.email}`}
                              className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                              </div>
                              <span className="text-sm">{profileData.email}</span>
                            </a>
                          )}
                          
                          {profileData.linkedin && (
                            <a
                              href={profileData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                              </div>
                              <span className="text-sm">LinkedIn Profile</span>
                            </a>
                          )}
                          
                          {profileData.github && (
                            <a
                              href={profileData.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                </svg>
                              </div>
                              <span className="text-sm">GitHub Profile</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* QR Code Area (placeholder) */}
                      <div className="flex items-end justify-between pt-4 border-t border-cyan-500/30">
                        <div className="text-xs text-gray-400">
                          <div className="text-cyan-400 font-semibold mb-1">Scan to connect</div>
                          <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                            <div className="text-2xl">📱</div>
                          </div>
                        </div>
                        <div className="text-xs text-cyan-400 opacity-70 animate-pulse">
                          ← Click to flip back
                        </div>
                      </div>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-br-full" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-tl-full" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            />
          </div>

          {/* Enter Portfolio Button */}
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            onClick={onClose}
            className="absolute bottom-20 px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              Enter Portfolio
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>

          {/* Hint Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute top-10 text-center"
          >
            <p className="text-gray-400 text-sm">Click the card to see contact information</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BusinessCardModal;