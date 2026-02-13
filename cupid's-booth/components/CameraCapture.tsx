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
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } },
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
      
      // Calculate aspect ratio crop (3:4 vertical)
      const aspect = 3/4;
      let w = video.videoWidth;
      let h = video.videoHeight;
      let sx = 0;
      let sy = 0;

      if (w / h > aspect) {
        const newW = h * aspect;
        sx = (w - newW) / 2;
        w = newW;
      } else {
        const newH = w / aspect;
        sy = (h - newH) / 2;
        h = newH;
      }

      canvas.width = 600; 
      canvas.height = 800;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, w, h, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
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
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      <canvas ref={canvasRef} className="hidden" />
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" 
      />

      {/* Flash */}
      <div className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-200 ${flash ? 'opacity-100' : 'opacity-0'}`} />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20">
        {/* Progress Dots */}
        <div className="flex gap-2 justify-center pt-8">
            {[0, 1].map((i) => (
                <div key={i} className={`h-3 rounded-full shadow-sm transition-all duration-500 ${photos.length > i ? 'w-8 bg-cupid-300' : 'w-3 bg-white/60'}`} />
            ))}
        </div>
      </div>

      {/* Countdown / Status Message */}
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        {countdown ? (
          <div key={countdown} className="animate-bounce">
              <span className="text-[12rem] font-bold text-white font-serif leading-none drop-shadow-2xl opacity-90">
                {countdown}
              </span>
          </div>
        ) : (
             !flash && photos.length < 2 && (
                <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/40 shadow-xl">
                    <span className="text-white font-serif text-2xl tracking-wider font-bold shadow-black drop-shadow-md">
                        {statusMessage}
                    </span>
                </div>
             )
        )}
      </div>

      {/* Guide Lines */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
         <div className="w-full h-full border-[1px] border-white/50 m-4 rounded-3xl box-border" style={{width: 'calc(100% - 2rem)', height: 'calc(100% - 2rem)'}}></div>
      </div>
    </div>
  );
};

export default CameraCapture;