import React, { useEffect, useState } from 'react';
import { generateCollage } from '../services/imageUtils';

interface PrintingProps {
  photos: string[];
  onComplete: (collageUrl: string) => void;
}

const Printing: React.FC<PrintingProps> = ({ photos, onComplete }) => {
  const [collage, setCollage] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepareAndPrint = async () => {
      try {
        const url = await generateCollage(photos[0], photos[1]);
        
        if (mounted) {
          setCollage(url);
          // Small buffer before starting the print animation
          setTimeout(() => {
            setIsPrinting(true);
          }, 500);

          // Animation duration + buffer
          setTimeout(() => {
            onComplete(url);
          }, 5000); 
        }
      } catch (error) {
        console.error("Failed to generate collage", error);
        if (mounted) onComplete(""); 
      }
    };

    prepareAndPrint();

    return () => {
      mounted = false;
    };
  }, [photos, onComplete]);

  return (
    <div className="h-full w-full bg-cupid-50 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Top Text */}
      <div className="absolute top-20 text-center space-y-2 z-30">
        <h2 className="font-serif font-bold text-cupid-500 text-2xl animate-pulse">
            Printing...
        </h2>
        <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-cupid-300 rounded-full animate-bounce [animation-delay:0ms]"></div>
            <div className="w-2 h-2 bg-cupid-300 rounded-full animate-bounce [animation-delay:150ms]"></div>
            <div className="w-2 h-2 bg-cupid-300 rounded-full animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>

      <div className="relative flex flex-col items-center">
          {/* PRINTER SLOT (The Gray Line) */}
          {/* This sits on top (z-20) to mask the photo as it comes out */}
          <div className="z-20 w-80 h-14 bg-white rounded-full shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] flex items-center justify-center border-2 border-cupid-100">
             {/* The physical slot look */}
             <div className="w-64 h-2 bg-gray-300 rounded-full shadow-inner border border-gray-400/20"></div>
          </div>

          {/* PAPER CONTAINER (The Clipped Area) */}
          {/* Sits below the slot (visually), but handled by z-index and masking */}
          <div className="relative z-10 w-72 h-[420px] -mt-7 overflow-hidden flex justify-center">
             {/* The Photo */}
             {collage && (
               <div className={`w-64 shadow-2xl transition-transform duration-[4000ms] ease-linear will-change-transform ${
                   isPrinting ? 'translate-y-[30px]' : '-translate-y-[110%]'
               }`}>
                  <img src={collage} alt="Print" className="w-full bg-white p-2" />
               </div>
             )}
          </div>
      </div>

      {/* Decorative Heart floaters */}
      <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none opacity-50">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C20,80 50,100 50,100 C50,100 80,80 100,100 Z" fill="#ffc2d1" />
           </svg>
      </div>

    </div>
  );
};

export default Printing;