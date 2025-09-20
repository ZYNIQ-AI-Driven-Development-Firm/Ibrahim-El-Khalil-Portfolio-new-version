import React from 'react';
import { PROFILE_DATA, SOCIAL_LINKS } from '../constants';
import { GithubIcon, LinkedInIcon, MailIcon } from './icons';

const Hero = () => {
  return (
    <div className="relative">
      <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Background crack effect */}
        <div className="crack-effect">
          <svg viewBox="0 0 200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="crackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(234, 35, 35, 0)'}} />
                <stop offset="20%" style={{stopColor: 'rgba(234, 35, 35, 0.4)'}} />
                <stop offset="80%" style={{stopColor: 'rgba(234, 35, 35, 0.4)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(234, 35, 35, 0)'}} />
              </linearGradient>
            </defs>
            <path d="M 100,0 C 105,50 95,100 100,150 C 105,175 98,190 100,200" stroke="url(#crackGradient)" strokeWidth="1.2" fill="none" />
            <path d="M 100,80 C 60,75 30,90 0,95" stroke="url(#crackGradient)" strokeWidth="0.8" fill="none" />
            <path d="M 100,120 C 140,125 170,110 200,105" stroke="url(#crackGradient)" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {PROFILE_DATA.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-300 font-light">
                {PROFILE_DATA.title}
              </h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              {PROFILE_DATA.summary}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 group"
                aria-label="Email Contact"
              >
                <MailIcon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img 
                  src={PROFILE_DATA.image} 
                  alt={PROFILE_DATA.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating indicator */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse border-2 border-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;