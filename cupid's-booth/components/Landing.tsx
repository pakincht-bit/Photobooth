import React from 'react';
import Button from './Button';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden bg-cupid-50 text-cupid-400">
      {/* Header */}
      <header className="pt-12 px-6 text-center z-10">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-cupid-300 drop-shadow-sm">
          be my valentine’s ?
        </h1>
      </header>

      {/* Main Illustration Area */}
      <div className="flex-1 relative w-full mt-8">
        {/* Booth Frame (Left Side) */}
        <div className="absolute left-6 top-10 w-40 h-64 border-2 border-cupid-300 bg-white flex flex-col items-center justify-center shadow-sm z-10">
           {/* Mirror / Screen */}
           <div className="w-32 h-48 border border-cupid-200 bg-cupid-50 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold opacity-60">faiistd,</span>
           </div>
        </div>

        {/* Start Button Container - positioned under the booth frame like the sketch */}
        <div className="absolute left-6 top-[320px] z-20">
             <Button label="start" onClick={onStart} />
        </div>

        {/* Curtains (Right Side) */}
        <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden pointer-events-none">
           {/* SVG Curtain Lines */}
           <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 200">
             <path d="M0,0 L0,150 C10,145 20,155 30,150 L30,0" fill="none" stroke="#ff8fa3" strokeWidth="0.5" />
             <path d="M30,0 L30,152 C40,148 50,158 60,152 L60,0" fill="none" stroke="#ff8fa3" strokeWidth="0.5" />
             <path d="M60,0 L60,150 C70,145 80,155 90,150 L90,0" fill="none" stroke="#ff8fa3" strokeWidth="0.5" />
             <path d="M90,0 L90,152 L100,152 L100,0" fill="none" stroke="#ff8fa3" strokeWidth="0.5" />
             {/* Curtain Bottom Hem */}
             <path d="M0,150 Q15,160 30,152 Q45,145 60,152 Q75,160 90,150 Q100,145 100,152" fill="none" stroke="#ff4d6d" strokeWidth="1" />
           </svg>
        </div>

        

        {/* Vertical Separator Line */}
        <div className="absolute left-[45%] top-0 bottom-0 w-px bg-cupid-300" />
      </div>

      {/* Footer Gingham Pattern */}
      <div className="h-24 w-full bg-white relative opacity-40">
        <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, #ffc2d1 25%, transparent 25%, transparent 75%, #ffc2d1 75%, #ffc2d1), repeating-linear-gradient(45deg, #ffc2d1 25%, #fff0f3 25%, #fff0f3 75%, #ffc2d1 75%, #ffc2d1)`,
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
        }}></div>
      </div>
    </div>
  );
};

export default Landing;