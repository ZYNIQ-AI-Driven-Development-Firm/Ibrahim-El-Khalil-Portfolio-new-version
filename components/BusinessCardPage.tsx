import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PROFILE_DATA, SOCIAL_LINKS } from '../constants';

const BusinessCardPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showGlow, setShowGlow] = useState(true);
  const navigate = useNavigate();

  const profileData = {
    ...PROFILE_DATA,
    linkedin: SOCIAL_LINKS.linkedin,
    github: SOCIAL_LINKS.github,
    email: SOCIAL_LINKS.email,
  };

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const glowInterval = setInterval(() => setShowGlow(prev => !prev), 3000);
    return () => clearInterval(glowInterval);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        setCardSize({ width: Math.round(r.width), height: Math.round(r.height) });
        // eslint-disable-next-line no-console
        console.log('Business card size:', Math.round(r.width), 'x', Math.round(r.height));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleCardClick = () => setIsFlipped(prev => !prev);
  const handleEnterPortfolio = () => navigate('/portfolio');

  return (
    <div className="fixed flex items-center justify-center w-screen h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a0000 50%, #330000 100%)', zIndex: 1 }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-red-400/30 rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>

      <motion.div className="absolute w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" style={{ top: '25%', right: '25%' }} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
      <motion.div className="absolute w-40 h-40 bg-red-700/10 rounded-full blur-3xl pointer-events-none" style={{ bottom: '25%', left: '25%' }} animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }} />

      <div style={{ perspective: '2000px', zIndex: 10 }}>
        <div ref={cardRef} style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, display: 'inline-block' }}>
          <motion.div initial={{ scale: 0.5, rotateY: -180, opacity: 0 }} animate={{ scale: 1, rotateY: 0, opacity: 1 }} transition={{ duration: 1.2, type: 'spring', stiffness: 50, delay: 0.3 }} style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }} onClick={handleCardClick}>
            <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.8, type: 'spring', stiffness: 100 }} style={{ transformStyle: 'preserve-3d', position: 'relative' }} whileHover={{ scale: 1.05 }}>
              <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <div className="rounded-3xl overflow-hidden flex items-center justify-center" style={{ width: 'min(600px, 90vw)', height: 'min(340px, 50vh)', background: 'linear-gradient(135deg, rgb(26, 0, 0) 0%, rgb(51, 0, 0) 50%, rgb(0, 0, 0) 100%)', boxShadow: showGlow ? 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(255, 0, 0, 0.1) 0px 0px 80px' : 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(255, 0, 0, 0.1) 0px 0px 80px', transition: 'box-shadow 3s ease-in-out' }}>
                  <div className="absolute inset-0 rounded-3xl border-2 border-red-500/40" />
                  <div className="absolute inset-0 opacity-10"><svg width="100%" height="100%"><pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M10 10 L90 10 L90 90 L10 90 Z" stroke="#ff0000" strokeWidth="0.5" fill="none" /><circle cx="10" cy="10" r="2" fill="#ff0000" /><circle cx="90" cy="90" r="2" fill="#ff0000" /></pattern><rect width="100%" height="100%" fill="url(#circuit)" /></svg></div>
                  <div className="relative h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="relative" style={{ transform: 'rotate(3deg)' }}>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden border-4 border-red-500/50 shadow-2xl">
                          <img src={profileData.image} alt={profileData.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse" />
                      </div>
                      <div className="text-right">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600" style={{ fontFamily: 'Orbitron, sans-serif' }}>BUSINESS CARD</motion.div>
                        <div className="text-xs text-red-400 mt-1">Digital Presence</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 30px rgba(255, 0, 0, 0.5)' }}>{profileData.name}</motion.h1>
                      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="text-sm sm:text-base lg:text-lg text-red-300 font-medium">{profileData.title}</motion.p>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex items-center justify-between pt-4 border-t border-red-500/30">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gray-300 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>{profileData.location}</div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>contact@khalilpreview.space</div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>+971585774519</div>
                      </div>
                      <div className="text-xs text-red-400 opacity-70 animate-pulse">Click to flip →</div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="rounded-3xl overflow-hidden flex items-center justify-center" style={{ width: 'min(600px, 90vw)', height: 'min(340px, 50vh)', background: 'linear-gradient(135deg, rgb(26, 0, 0) 0%, rgb(51, 0, 0) 50%, rgb(0, 0, 0) 100%)', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 30px 60px, rgba(255, 0, 0, 0.1) 0px 0px 80px' }}>
                  <div className="absolute inset-0 rounded-3xl border-2 border-red-500/40" />
                  <div className="relative h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>Let's Connect</h2>
                      <div className="space-y-4">
                        <a href="mailto:contact@khalilpreview.space" className="flex items-center gap-4 text-gray-300 hover:text-red-400 transition-colors group"><div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg></div><span className="text-sm">contact@khalilpreview.space</span></a>
                        <a href="tel:+971585774519" className="flex items-center gap-4 text-gray-300 hover:text-red-400 transition-colors group"><div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg></div><span className="text-sm">+971 585 774 519</span></a>
                      </div>
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-red-500/30">
                      <div className="text-xs text-gray-400"><div className="text-red-400 font-semibold mb-1">Scan to connect</div><div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center"><div className="text-2xl">📱</div></div></div>
                      <div className="text-xs text-red-400 opacity-70 animate-pulse">← Click to flip back</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.button initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} onClick={handleEnterPortfolio} className="absolute bottom-8 left-1/2 px-12 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-full shadow-2xl transition-all duration-300" style={{ fontFamily: 'Orbitron, sans-serif', transform: 'translateX(-50%)', zIndex: 20 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <span className="flex items-center gap-3">Enter Portfolio<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></span>
      </motion.button>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute top-8 left-1/2 text-center" style={{ transform: 'translateX(-50%)', zIndex: 20 }}>
        <p className="text-gray-400 text-sm">Click the card to see contact information</p>
      </motion.div>

      {/* Debug controls removed — final offset applied and persisted */}
    </div>
  );
};

export default BusinessCardPage;
