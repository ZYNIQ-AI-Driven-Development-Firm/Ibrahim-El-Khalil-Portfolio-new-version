import React from 'react';
import { EXPERIENCE_DATA } from '../constants';
import { ExperienceItem } from '../types';

const CrackSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M150 0 V200" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="1" />
            <path d="M150 100 H50" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
        </svg>
    </div>
);

const ExperienceCard: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <div className="mb-8 p-6 rounded-lg glass-card">
    <CrackSVG />
    <div className="flex justify-between items-baseline mb-2">
      <h3 className="text-xl font-bold text-slate-200">{item.role}</h3>
      <div className="text-sm text-gray-400">{item.period}</div>
    </div>
    <div className="flex justify-between items-baseline mb-4">
        <h4 className="text-lg text-gray-300">{item.company}</h4>
        <div className="text-sm text-gray-400">{item.location}</div>
    </div>
    <ul className="list-disc list-inside text-gray-300 space-y-2">
      {item.description.map((desc, index) => (
        <li key={index}>{desc}</li>
      ))}
    </ul>
    {item.projects && (
        <div className="mt-4 pt-4 border-t border-white/10">
            <h5 className="font-semibold text-gray-200 mb-2">Key Projects:</h5>
            {item.projects.map((project, index) => (
                <div key={index} className="pl-4">
                    <p className="font-medium text-gray-300">{project.name}</p>
                    <p className="text-sm text-gray-400">{project.description}</p>
                </div>
            ))}
        </div>
    )}
  </div>
);

const Experience: React.FC = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Work Experience</h2>
      <div>
        {EXPERIENCE_DATA.map((item, index) => (
          <ExperienceCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Experience;