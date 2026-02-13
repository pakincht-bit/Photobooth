import React, { useEffect, useState } from 'react';
import Button from './Button';
import { RefreshCcw, Share2 } from 'lucide-react';
import { generateCollage } from '../services/imageUtils';

interface PhotoGridProps {
  photos: string[];
  initialCollage?: string | null;
  onRetake: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, initialCollage, onRetake }) => {
  const [finalImage, setFinalImage] = useState<string | null>(initialCollage || null);

  useEffect(() => {
    if (!finalImage && photos.length === 2) {
      generateCollage(photos[0], photos[1])
        .then(url => setFinalImage(url))
        .catch(err => console.error(err));
    }
  }, [photos, finalImage]);

  const handleDownload = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.href = finalImage;
      link.download = `cupid-booth-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (finalImage && navigator.share) {
      try {
        const blob = await (await fetch(finalImage)).blob();
        const file = new File([blob], "cupid-photo.png", { type: "image/png" });
        await navigator.share({
            files: [file],
            title: "My Cupid's Booth Photo",
            text: "Check out my Valentine's vibe! 💖"
        });
      } catch (e) {
        console.log("Sharing failed or cancelled", e);
      }
    } else {
        handleDownload();
    }
  };

  if (!finalImage) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-cupid-50 text-cupid-400 font-serif">
        <span className="animate-pulse">Developing your love...</span>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-cupid-50 flex flex-col items-center overflow-y-auto animate-fade-in py-8 px-4">
      <h2 className="text-3xl font-serif font-bold text-cupid-500 mb-6 text-center">Your Valentine Card</h2>
      
      {/* Photo Container */}
      <div className="relative shadow-2xl mb-8 w-full max-w-[340px] group transform transition-transform hover:scale-[1.02] duration-300">
        
        {/* Realistic Tape Effect */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 w-32 h-10 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full bg-white/50 backdrop-blur-sm shadow-[0_2px_4px_rgba(0,0,0,0.1)] -rotate-2 border-l border-r border-white/30 mix-blend-hard-light"></div>
        </div>

        <img 
            src={finalImage} 
            alt="Final Collage" 
            className="w-full h-auto block bg-white"
        />
      </div>

      <div className="flex flex-col gap-3 w-full max-w-[340px] pb-8">
        <Button 
            variant="primary" 
            label="Save Photo" 
            onClick={handleDownload} 
            className="w-full"
        />
        
        <div className="flex gap-3">
             <button 
                onClick={onRetake}
                className="flex-1 py-4 border-2 border-cupid-200 text-cupid-400 font-serif rounded-none hover:bg-white flex items-center justify-center gap-2 transition-colors"
            >
                <RefreshCcw size={20} />
                Retake
            </button>
            <button 
                onClick={handleShare}
                className="flex-1 py-4 bg-cupid-400 text-white font-serif rounded-none hover:bg-cupid-500 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
                <Share2 size={20} />
                Share
            </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoGrid;