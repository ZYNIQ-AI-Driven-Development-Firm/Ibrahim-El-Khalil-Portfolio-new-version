import React, { useState } from 'react';
import { VENTURES_DATA } from '../constants';
import { VentureItem } from '../types';
import { PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

const CrackSVG: React.FC<{style?: React.CSSProperties}> = ({style}) => (
    <div className="crack-effect" style={style}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M200 0 V200" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="1" />
            <path d="M200 100 H0" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
            <path d="M200 100 H400" stroke="rgba(234, 35, 35, 0.6)" strokeWidth="0.5" />
        </svg>
    </div>
);


const VentureCard: React.FC<{ item: VentureItem }> = ({ item }) => (
  <div className="w-full h-full flex flex-col justify-between p-6 rounded-lg glass-card text-center">
    <CrackSVG />
    <div>
        {item.logoPlaceholder && (
            <div className="mx-auto w-16 h-16 mb-4 bg-slate-700/80 rounded-full flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-slate-400" />
            </div>
        )}
        <h3 className="text-xl font-bold text-slate-200">{item.name}</h3>
        {item.tagline && <p className="text-sm text-slate-400 italic mt-1">{item.tagline}</p>}
        <p className="text-gray-300 mt-3 text-base flex-grow">{item.description}</p>
    </div>
    {item.byline && <p className="text-xs text-slate-500 mt-4">{item.byline}</p>}
  </div>
);


const Ventures: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const venturesPerPage = 3;

    const totalPages = Math.ceil(VENTURES_DATA.length / venturesPerPage);

    const nextVentures = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
    };

    const prevVentures = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
    };
    
    const startIndex = currentIndex * venturesPerPage;
    const selectedVentures = VENTURES_DATA.slice(startIndex, startIndex + venturesPerPage);

    return (
        <section>
            <h2 className="text-3xl font-bold mb-8 text-center md:text-left">Ventures & Entrepreneurship</h2>
            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[320px]">
                    {selectedVentures.map((item, index) => (
                        <VentureCard key={startIndex + index} item={item} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <>
                        <button 
                            onClick={prevVentures} 
                            className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-slate-800/80 p-2 rounded-full hover:bg-[#EA2323] transition-colors z-10"
                            aria-label="Previous ventures"
                        >
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextVentures} 
                            className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-slate-800/80 p-2 rounded-full hover:bg-[#EA2323] transition-colors z-10"
                            aria-label="Next ventures"
                        >
                            <ChevronRightIcon className="w-6 h-6" />
                        </button>

                        <div className="flex justify-center mt-8 space-x-2">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-[#EA2323]' : 'bg-slate-600 hover:bg-slate-500'}`}
                                    aria-label={`Go to page ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Ventures;
