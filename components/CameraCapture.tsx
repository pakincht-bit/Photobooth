import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraCaptureProps {
  onComplete: (photos: string[]) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [flash, setFlash] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Get Ready...");

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        // Removing specific resolution constraints helps prevent the "zoomed in" effect
        // on mobile browsers which sometimes switch to a crop mode for high res.
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(err);
        setError("Please allow camera access to use the booth!");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // We want to capture exactly what is shown in the 3:4 container.
      // The container forces the video to be object-cover within a 3:4 box.
      const aspect = 3/4;
      
      // Video intrinsic dimensions
      const vW = video.videoWidth;
      const vH = video.videoHeight;
      const videoAspect = vW / vH;

      // Calculate the crop to match CSS object-cover behavior in a 3:4 container
      let sx, sy, sW, sH;

      if (videoAspect > aspect) {
        // Video is wider than 3:4 (e.g. 16:9 or 4:3).
        // Height matches, width is cropped.
        sH = vH;
        sW = vH * aspect;
        sy = 0;
        sx = (vW - sW) / 2;
      } else {
        // Video is taller than 3:4 (rare for webcam, but possible on mobile portrait native).
        // Width matches, height is cropped.
        sW = vW;
        sH = vW / aspect;
        sx = 0;
        sy = (vH - sH) / 2;
      }

      // Output resolution (high quality)
      canvas.width = 900; 
      canvas.height = 1200; // 3:4 ratio
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        // Draw the cropped portion
        ctx.drawImage(video, sx, sy, sW, sH, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
        setPhotos(prev => [...prev, dataUrl]);
      }
    }
  }, []);

  const startCountdown = useCallback(() => {
    setStatusMessage("Pose!");
    let count = 3;
    setCountdown(count);
    
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);
        capture();
      }
    }, 1000);
  }, [capture]);

  // Sequence Controller
  useEffect(() => {
    if (!stream) return;

    // Initial Delay before first photo
    if (photos.length === 0 && !countdown) {
        const timer = setTimeout(() => {
            startCountdown();
        }, 2000); // 2 seconds to get ready initially
        return () => clearTimeout(timer);
    } 
    // Delay between photos
    else if (photos.length === 1 && !countdown) {
        setStatusMessage("Next Pose!");
        const timer = setTimeout(() => {
            startCountdown();
        }, 2000);
        return () => clearTimeout(timer);
    } 
    // Completion
    else if (photos.length === 2) {
        const timer = setTimeout(() => {
            onComplete(photos);
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [stream, photos.length, countdown, startCountdown, onComplete]);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-cupid-50">
        <p className="text-cupid-500 font-serif text-xl">{error}</p>
        <button onClick={() => window.location.reload()} className="underline text-cupid-400">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-cupid-50 overflow-hidden flex flex-col items-center justify-center p-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 
          Frame Container: 
          Fixes the aspect ratio to 3:4 so user sees exactly what will be captured.
          This prevents the "zoomed in" feeling of object-cover on a tall screen.
      */}
      <div className="relative w-full max-w-[400px] aspect-[3/4] bg-black rounded-sm shadow-2xl overflow-hidden border-[8px] border-white">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" 
          />

          {/* Flash Overlay */}
          <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />

          {/* Countdown Overlay (Centered in frame) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            {countdown && (
              <div key={countdown} className="animate-bounce">
                  <span className="text-[8rem] font-bold text-white font-serif leading-none drop-shadow-lg opacity-90">
                    {countdown}
                  </span>
              </div>
            )}
          </div>
      </div>

      {/* Status Message Area (Outside the photo frame) */}
      <div className="mt-8 h-12 flex items-center justify-center z-20">
         {!flash && photos.length < 2 && !countdown && (
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-cupid-200 shadow-md">
                <span className="text-cupid-500 font-serif text-xl font-bold">
                    {statusMessage}
                </span>
            </div>
         )}
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-10 left-0 w-full flex gap-3 justify-center">
        {[0, 1].map((i) => (
            <div key={i} className={`h-3 rounded-full transition-all duration-500 shadow-sm border border-cupid-200 ${photos.length > i ? 'w-8 bg-cupid-400' : 'w-3 bg-white'}`} />
        ))}
      </div>

      {/* Background decoration to fill space */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cupid-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cupid-200 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default CameraCapture;