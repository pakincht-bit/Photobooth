import React, { useState } from 'react';
import Landing from './components/Landing';
import Instruction from './components/Instruction';
import CameraCapture from './components/CameraCapture';
import PhotoGrid from './components/PhotoGrid';
import Printing from './components/Printing';

type Step = 'landing' | 'instruction' | 'capture' | 'printing' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('landing');
  const [photos, setPhotos] = useState<string[]>([]);
  const [generatedCollage, setGeneratedCollage] = useState<string | null>(null);

  const handleCaptureComplete = (capturedPhotos: string[]) => {
    setPhotos(capturedPhotos);
    setStep('printing');
  };

  const handlePrintingComplete = (collageUrl: string) => {
    setGeneratedCollage(collageUrl);
    setStep('result');
  };

  const handleRetake = () => {
    setPhotos([]);
    setGeneratedCollage(null);
    setStep('landing');
  };

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative border-x border-cupid-100">
      {step === 'landing' && (
        <Landing onStart={() => setStep('instruction')} />
      )}
      
      {step === 'instruction' && (
        <Instruction onNext={() => setStep('capture')} />
      )}
      
      {step === 'capture' && (
        <CameraCapture onComplete={handleCaptureComplete} />
      )}

      {step === 'printing' && (
        <Printing photos={photos} onComplete={handlePrintingComplete} />
      )}
      
      {step === 'result' && (
        <PhotoGrid 
          photos={photos} 
          initialCollage={generatedCollage}
          onRetake={handleRetake} 
        />
      )}
    </div>
  );
};

export default App;