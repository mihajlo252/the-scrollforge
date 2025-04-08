import { useEffect, useState } from "react";
import { getImageFromStorage } from "../utilities/getImageFromStorage";

export const ImageWithFallback = ({ bucket, folder, name, alt, fallbackSrc } : { bucket: string, folder: string, name: string, alt: string, fallbackSrc: string }) => {
    const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
    const [attemptedDB, setAttemptedDB] = useState<boolean>(false);

    const handleGetImageFromStorage = async () => {
        const {publicUrl}  = await getImageFromStorage({bucket: bucket, folder: folder, name: name})
        if (publicUrl.endsWith("null")) {
            setAttemptedDB(true);
            return
        }
        setImageSrc(publicUrl)
    }
    
    useEffect(() => {
        handleGetImageFromStorage();
    }, [])
  
    
  
    return <img src={imageSrc} alt={alt} className={`h-20 w-20 rounded-badge border-2 border-slate-900 ${attemptedDB ? 'opacity-50 p-2' : ''}`} />
  }
