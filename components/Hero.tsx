import React, { useState, useEffect } from 'react';
import { PROFILE_DATA, SOCIAL_LINKS, SKILLS_DATA } from '../constants';
import { GithubIcon, LinkedInIcon, MailIcon, CpuChipIcon } from './icons';

const allSkills = SKILLS_DATA.flatMap(category => category.skills);

const CrackSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 300 300" preserveAspectRatio="none">
            <path d="M50 0 V300" stroke="rgba(234, 35, 35, 0.7)" strokeWidth="1" />
            <path d="M50 150 H150" stroke="rgba(234, 35, 35, 0.7)" strokeWidth="0.5" />
             <path d="M150 150 L200 200" stroke="rgba(234, 35, 35, 0.7)" strokeWidth="0.5" />
        </svg>
    </div>
);

const TechFeed: React.FC = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let ticker: NodeJS.Timeout;
        const period = 2000;

        const tick = () => {
            const i = loopNum % allSkills.length;
            const fullText = allSkills[i];

            let newText = isDeleting
                ? fullText.substring(0, displayedText.length - 1)
                : fullText.substring(0, displayedText.length + 1);

            setDisplayedText(newText);

            if (!isDeleting && newText === fullText) {
                setIsDeleting(true);
                ticker = setTimeout(tick, period);
            } else if (isDeleting && newText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            } else {
                const delta = isDeleting ? 50 : 100;
                ticker = setTimeout(tick, delta);
            }
        };

        ticker = setTimeout(tick, 100);

        return () => clearTimeout(ticker);
    }, [displayedText, isDeleting, loopNum]);


    return (
        <div className="glass-card p-4 rounded-lg mt-8 md:mt-0 md:w-full max-w-sm">
            <CrackSVG />
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <CpuChipIcon className="w-5 h-5 text-slate-300" />
                    <span>Real-time Tech Feed</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA2323]"></span>
                    </span>
                    <span className="text-sm font-semibold text-[#EA2323]">LIVE</span>
                </div>
            </div>
            <div className="bg-black/50 p-3 rounded h-16 flex items-center">
                <p className="text-lg font-mono text-slate-300">{displayedText}<span className="animate-pulse text-[#EA2323]">|</span></p>
            </div>
        </div>
    );
}


const Hero: React.FC = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[80vh]">
        <div className="flex-1 max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={PROFILE_DATA.image}
                    alt={PROFILE_DATA.name}
                    className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-gray-700"
                />
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-4">
                        {PROFILE_DATA.name}
                         <div className="flex space-x-4 items-center">
                            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn Profile">
                                <LinkedInIcon className="w-6 h-6" />
                            </a>
                            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub Profile">
                                <GithubIcon className="w-6 h-6" />
                            </a>
                            <a href={`mailto:${SOCIAL_LINKS.email}`} className="text-gray-400 hover:text-white transition-colors" aria-label="Email">
                                <MailIcon className="w-6 h-6" />
                            </a>
                        </div>
                    </h1>
                    <h2 className="text-xl md:text-2xl text-slate-300 font-semibold">{PROFILE_DATA.title}</h2>
                </div>
            </div>

            <p className="text-gray-300 text-lg mb-6">{PROFILE_DATA.summary}</p>
        </div>
        <div className="flex-shrink-0 md:ml-12">
            <TechFeed />
        </div>
    </section>
  );
};

export default Hero;