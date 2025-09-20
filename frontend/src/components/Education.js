import React from 'react';
import { EDUCATION_DATA } from '../constants';

const CrackSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 200 200" preserveAspectRatio="none">
            <path d="M 0 50 H200" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
            <path d="M100 50 V150" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="1" />
        </svg>
    </div>
);

const Education: React.FC = () => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Education</h2>
      <div className="space-y-8">
        {EDUCATION_DATA.map((item, index) => (
          <div key={index} className="p-6 rounded-lg glass-card">
            <CrackSVG />
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="text-xl font-bold text-slate-200">{item.degree}</h3>
              <div className="text-sm text-gray-400">{item.period}</div>
            </div>
            <div className="flex justify-between items-baseline mb-3">
              <h4 className="text-lg text-gray-300">{item.institution}</h4>
              <div className="text-sm text-gray-400">{item.location}</div>
            </div>
            {item.description && <p className="text-gray-300">{item.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;