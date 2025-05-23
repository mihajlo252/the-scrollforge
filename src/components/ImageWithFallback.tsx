import { useEffect, useState } from "react";
import { getImageFromStorage } from "../utilities/getImageFromStorage";
import { Popup } from "./Popup";
import { AnimatePresence } from "framer-motion";
import { supabase } from "../supabase/supabase";
import { sendData } from "../utilities/sendData";
import { toast } from "../utilities/toasterSonner";

export const ImageWithFallback = ({
    bucket,
    id,
    folder,
    name,
    characterName,
    alt,
    fallbackSrc,
}: {
    bucket: string;
    id: string;
    folder: string;
    name: string;
    characterName: string;
    alt: string;
    fallbackSrc: string;
}) => {
    const [imageSrc, setImageSrc] = useState<string>(fallbackSrc);
    const [attemptedDB, setAttemptedDB] = useState<boolean>(false);
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState<File | null>();

    const handleGetImageFromStorage = async () => {
        const { publicUrl  } = await getImageFromStorage({ bucket: bucket, folder: folder, name: name });
        if (publicUrl == null) {
            setAttemptedDB(true);
            return;
        }
        setImageSrc(publicUrl);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.storage.from("characters").upload(`${folder}/${characterName}.png`, image as File, {cacheControl: "3", upsert: true });
        if (error) {
            console.error(error);
            return;
        }
        await sendData("characters", id, { avatar: `${characterName}.png` });
        handleGetImageFromStorage();
        setEdit(false);
        setAttemptedDB(false);
        toast({ style: "bg-primary border-primary text-base-100", message: "Image changed, please refresh the page" });
    };

    const handleFallback = () => {
        setImageSrc(fallbackSrc);
        setEdit(false);
        setAttemptedDB(true);
    }

    useEffect(() => {
        handleGetImageFromStorage();
        console.log(imageSrc);
    }, [])

    return (
        <>
            <button type="button" className="relative" onClick={() => setEdit(true)}>
                <img src={imageSrc} onError={handleFallback} alt={alt} className={`object-contain max-h-24 w-24 rounded-badge border-2 border-slate-900 ${attemptedDB ? "opacity-50 p-2" : ""}`} />
            </button>
            <AnimatePresence>
                {edit && (
                    <Popup closerFunc={setEdit}>
                        <form onSubmit={(e) => handleSave(e)} className="flex flex-col gap-5">
                            <h2 className="mb-10 text-3xl text-accent">Upload Image</h2>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files![0])}
                                className="file-input file-input-bordered file-input-accent w-full max-w-xs flex-grow place-self-center"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="btn btn-accent flex-grow">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary flex-grow"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setEdit(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                            <p className="text-[18px]">
                                Please name your image <span className="text-secondary">*name-of-character*.png</span>
                            </p>
                        </form>
                    </Popup>
                )}
            </AnimatePresence>
        </>
    );
};
