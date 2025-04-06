import { useState } from "react";

export const ImageWithFallback = ({ source, alt, fallbackSrc } : { source: string, alt: string, fallbackSrc: string }) => {
    const [imageSrc, setImageSrc] = useState<string>(source);
    const [attemptedDB, setAttemptedDB] = useState<boolean>(false);
  
    // Function to handle the error when the image fails to load
    const handleError = () => {
        setAttemptedDB(true);
        setImageSrc(fallbackSrc);
    };
  
    return <img src={imageSrc} alt={alt} onError={handleError} className={`h-20 w-20 rounded-badge border-2 border-slate-900 ${attemptedDB ? 'opacity-50 p-2' : ''}`} />
  }
