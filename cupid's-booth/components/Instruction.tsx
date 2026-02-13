import React from 'react';
import Button from './Button';
import { Camera } from 'lucide-react';

interface InstructionProps {
  onNext: () => void;
}

const Instruction: React.FC<InstructionProps> = ({ onNext }) => {
  return (
    <div className="flex flex-col h-full w-full bg-cupid-50 p-6 items-center justify-between py-12 animate-fade-in relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cupid-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cupid-200 rounded-full blur-3xl"></div>
      </div>

      {/* Top Section */}
      <div className="text-center space-y-6 max-w-xs z-10">
        <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-cupid-200 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-cupid-200 text-cupid-500 shadow-md">
                <Camera size={40} />
            </div>
        </div>
        
        <div className="space-y-3">
            <h2 className="text-3xl font-serif font-bold text-cupid-500">Photo Booth</h2>
            <p className="text-cupid-400 font-serif text-lg leading-relaxed">
              We'll take 2 photos to fill your card.
            </p>
        </div>
      </div>

      {/* Visual Guide */}
      <div className="relative z-10">
        <div className="relative w-56 aspect-[3/4] bg-white p-2 shadow-xl rotate-[-2deg] border border-cupid-100 flex flex-col gap-2">
            
            {/* Top Row */}
            <div className="flex-1 flex gap-2">
                <div className="flex-1 bg-cupid-100 border-2 border-dashed border-cupid-300 flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs font-bold text-cupid-500 z-10">1. YOU</span>
                </div>
                <div className="flex-1 bg-cupid-50 flex items-center justify-center">
                    <div className="w-8 h-1 bg-cupid-200 rounded-full"></div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex-1 flex gap-2">
                <div className="flex-1 bg-cupid-50 flex items-center justify-center">
                    <div className="w-8 h-1 bg-cupid-200 rounded-full"></div>
                </div>
                <div className="flex-1 bg-cupid-100 border-2 border-dashed border-cupid-300 flex items-center justify-center relative overflow-hidden">
                    <span className="text-xs font-bold text-cupid-500 z-10">2. YOU</span>
                </div>
            </div>
        </div>
        <p className="text-center text-xs text-cupid-300 mt-4 font-serif italic">
            Get ready to strike a pose!
        </p>
      </div>

      {/* Action Area */}
      <div className="w-full max-w-xs space-y-3 z-10">
        <Button label="Start Taking Photos" onClick={onNext} className="w-full shadow-lg text-lg py-4" />
      </div>
    </div>
  );
};

export default Instruction;