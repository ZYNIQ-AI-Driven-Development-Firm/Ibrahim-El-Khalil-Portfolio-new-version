import React from 'react';
import { PROFILE_DATA, SOCIAL_LINKS } from '../constants';
import { GithubIcon, LinkedInIcon, MailIcon } from './icons';

const Hero = () => {
  return (
    <div className="relative">
      <div className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Background crack effect */}
        <div className="crack-effect">
          <svg viewBox="0 0 200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="crackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(234, 35, 35, 0)'}} />
                <stop offset="20%" style={{stopColor: 'rgba(234, 35, 35, 0.3)'}} />
                <stop offset="80%" style={{stopColor: 'rgba(234, 35, 35, 0.3)'}} />
                <stop offset="100%" style={{stopColor: 'rgba(234, 35, 35, 0)'}} />
              </linearGradient>
            </defs>
            <path d="M 100,0 C 105,50 95,100 100,150 C 105,175 98,190 100,200" stroke="url(#crackGradient)" strokeWidth="1" fill="none" />
            <path d="M 100,80 C 60,75 30,90 0,95" stroke="url(#crackGradient)" strokeWidth="0.6" fill="none" />
            <path d="M 100,120 C 140,125 170,110 200,105" stroke="url(#crackGradient)" strokeWidth="0.6" fill="none" />
          </svg>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Content */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {PROFILE_DATA.name}
              </h1>
              <h2 className="text-lg md:text-xl text-red-400 font-medium">
                {PROFILE_DATA.title}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Available for opportunities</span>
              </div>
            </div>
            
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {PROFILE_DATA.summary}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              <a 
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                aria-label="LinkedIn Profile"
              >
                <LinkedInIcon className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
              </a>
              <a 
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-105 group"
                aria-label="Email Contact"
              >
                <MailIcon className="w-5 h-5 text-gray-300 group-hover:text-red-400 transition-colors duration-300" />
              </a>
            </div>
          </div>
          
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                <img 
                  src={PROFILE_DATA.image} 
                  alt={PROFILE_DATA.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;