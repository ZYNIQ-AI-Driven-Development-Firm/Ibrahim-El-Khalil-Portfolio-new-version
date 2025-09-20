import React, { useState } from 'react';

const BookmarkBar = ({ onAppointmentClick }) => {
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
      notification: true
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
      onClick: () => {}, // Will be passed from parent
      notification: false
    }
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col space-y-2">
        {bookmarkButtons.map((button, index) => (
          <div
            key={button.id}
            className="relative group"
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Main Bookmark Button */}
            <div 
              className={`relative bg-gradient-to-l ${
                hoveredButton === button.id ? button.hoverColor : button.color
              } text-white cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden border border-white/20 shadow-2xl`}
              onClick={button.onClick}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)',
                paddingLeft: '16px',
                paddingRight: hoveredButton === button.id ? '28px' : '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
                width: hoveredButton === button.id ? '140px' : '60px',
                transform: hoveredButton === button.id ? 'translateX(0)' : 'translateX(calc(100% - 45px))'
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="relative flex-shrink-0">
                  {button.icon}
                  
                  {/* Notification dot */}
                  {button.notification && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span 
                  className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                    hoveredButton === button.id ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: hoveredButton === button.id ? 'translateX(0)' : 'translateX(calc(100% - 45px))'
                  }}
                >
                  {button.label}
                </span>
              </div>
              
              {/* Bookmark perforations - only show when hovered */}
              {hoveredButton === button.id && (
                <>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                  </div>
                  <div className="absolute left-2 top-1/3 transform -translate-y-1/2">
                    <div className="w-0.5 h-0.5 bg-white/20 rounded-full"></div>
                  </div>
                  <div className="absolute left-2 bottom-1/3 transform translate-y-1/2">
                    <div className="w-0.5 h-0.5 bg-white/20 rounded-full"></div>
                  </div>
                </>
              )}
            </div>
            
            {/* Tooltip - only show when hovered and extended */}
            {hoveredButton === button.id && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 bg-black text-white text-xs py-2 px-3 rounded whitespace-nowrap transition-all duration-300 z-10 animate-in fade-in slide-in-from-right-2">
                Schedule a meeting with Ibrahim
                {/* Arrow pointing to button */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
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