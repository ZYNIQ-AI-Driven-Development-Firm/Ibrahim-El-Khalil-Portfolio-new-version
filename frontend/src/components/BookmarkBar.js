import React, { useState } from 'react';

const BookmarkBar = ({ onAppointmentClick, onSkillsClick }) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const bookmarkButtons = [
    {
      id: 'appointment',
      label: 'Book Meeting',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      color: 'from-blue-600 to-indigo-700',
      hoverColor: 'from-blue-700 to-indigo-800',
      onClick: onAppointmentClick,
      notification: true,
      tooltip: 'Schedule a meeting with Ibrahim'
    },
    {
      id: 'skills',
      label: 'Skills & Tech',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="14" x2="23" y2="14"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="14" x2="4" y2="14"></line>
        </svg>
      ),
      color: 'from-green-600 to-emerald-700',
      hoverColor: 'from-green-700 to-emerald-800',
      onClick: onSkillsClick,
      notification: false,
      tooltip: 'View technical skills and proficiency'
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col space-y-3">
        {bookmarkButtons.map((button, index) => (
          <div
            key={button.id}
            className="relative group"
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Main Bookmark Button - Rectangular, Transparent, Thin */}
            <div 
              className={`relative backdrop-blur-md cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border flex flex-col items-center justify-center rounded-l-xl overflow-hidden ${
                hoveredButton === button.id 
                  ? button.color.replace('from', 'bg').split(' ')[0].replace('bg-blue-600', 'bg-blue-500/30').replace('bg-green-600', 'bg-green-500/30') + ' border-white/30'
                  : 'bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30'
              }`}
              onClick={button.onClick}
              style={{
                paddingLeft: '8px',
                paddingRight: '8px',
                paddingTop: '12px',
                paddingBottom: '12px',
                width: '48px',
                minHeight: '100px'
              }}
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

              <div className="relative flex flex-col items-center gap-2 z-10">
                <div className="relative flex-shrink-0">
                  <div className="w-[16px] h-[16px] text-white/80 group-hover:text-white transition-colors">
                    {button.icon}
                  </div>
                  
                  {/* Notification dot */}
                  {button.notification && (
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span 
                  className="text-white/70 group-hover:text-white text-[9px] font-medium tracking-widest transition-colors"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {button.label === 'Book Meeting' ? 'MEET' : button.label === 'Skills & Tech' ? 'SKILLS' : button.label}
                </span>
              </div>

              {/* Subtle glow on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                button.id === 'appointment' ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10' : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
              }`}></div>
            </div>
            
            {/* Tooltip - show on hover */}
            {hoveredButton === button.id && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-black/90 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-lg whitespace-nowrap transition-all duration-300 z-10 shadow-lg border border-white/10">
                {button.tooltip}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500/10 to-transparent blur-xl -z-10"></div>
    </div>
  );
};

export default BookmarkBar;