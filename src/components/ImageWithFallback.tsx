import { useState } from "react";

export const ImageWithFallback = ({ source, alt, fallbackSrc } : { source: string, alt: string, fallbackSrc: string }) => {
    const [imageSrc, setImageSrc] = useState<string>(source);
    const [attemptedPng, setAttemptedPng] = useState(false);
    const [attemptedJpg, setAttemptedJpg] = useState(false);
  
    // Function to handle the error when the image fails to load
    const handleError = () => {
      if (!attemptedPng) {
        // If we haven't attempted the PNG yet, try loading the JPG
        setAttemptedPng(true);
        setImageSrc(source.replace('.png', '.jpg')); // Try JPG
      } else if (!attemptedJpg) {
        // If we have already tried PNG and JPG, try loading the JPEG
        setAttemptedJpg(true);
        setImageSrc(fallbackSrc); // Fallback to default PNG
      }
    };
  
    return <img src={imageSrc} alt={alt} onError={handleError} className={`h-20 w-20 rounded-badge border-2 border-slate-900 ${attemptedJpg ? 'opacity-50 p-2' : ''}`} />
  }
