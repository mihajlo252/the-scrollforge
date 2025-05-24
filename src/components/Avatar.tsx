import { useEffect, useState } from "react";
import { getImageFromStorage } from "../utilities/getImageFromStorage";
import { Popup } from "./Popup";
import { AnimatePresence } from "framer-motion";
import { supabase } from "../supabase/supabase";
import { toast } from "../utilities/toasterSonner";
import { BorderButton } from "./BorderButton";

export const Avatar = ({
    bucket,
    characterName,
}: {
    bucket: string;
    characterName: string;
}) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const [edit, setEdit] = useState(false);

    const handleGetImageFromStorage = async () => {
        const { publicUrl } = await getImageFromStorage({ bucket: bucket, name: `${characterName}.png` });
        if (publicUrl !== null) {
            setImageSrc(`${publicUrl}?t=${Date.now()}`);
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const file = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement).files?.[0];
        if (!file) return;
        if (file?.size > 1048576) {
            toast({ style: "bg-error text-base-100", message: "File is too large! Please keep file size below 1MB." });
            return;
        }
        const { error } = await supabase.storage
            .from("characters")
            .upload(`${characterName}.png`, file as File, { cacheControl: "0", upsert: true });
        if (error) {
            return;
        }
        setEdit(false);
        setImageSrc((prev) => `${prev}?t=${Date.now()}`);
        toast({ style: "bg-primary text-base-100", message: "Image changed. It might take some time to update." });
    };

    const handleRemoveImage = async () => {
        await supabase.storage.from("characters").remove([`${characterName}.png`]);
        setImageSrc((prev) => `${prev}?t=${Date.now()}`);
        setEdit(false);
        toast({ style: "bg-primary text-base-100", message: "Image removed. It might take some time to update." });
    };

    useEffect(() => {
        handleGetImageFromStorage();
    }, []);

    return (
        <>
            <button
                type="button"
                className="relative aspect-square w-24 overflow-hidden rounded-badge border-2 border-slate-900"
                onClick={() => setEdit(true)}
            >
                <img
                    src={imageSrc}
                    alt={(characterName.charAt(0) + characterName.charAt(1)).toUpperCase()}
                    className={`object-cover object-top text-center text-4xl text-primary`}
                />
                <div className="absolute inset-0 place-content-center bg-black/50 text-lg opacity-0 transition-opacity hover:opacity-100">
                    <p>Edit</p>
                </div>
            </button>
            <AnimatePresence>
                {edit && (
                    <Popup closerFunc={setEdit}>
                        <form onSubmit={handleSave} className="flex flex-col gap-5">
                            <h2 className="mb-10 text-3xl text-accent">Upload Image</h2>
                            <input
                                type="file"
                                accept="image/*"
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
                            <BorderButton
                                text="Remove Image"
                                style="border-secondary py-4 text-secondary hover:bg-secondary hover:text-white"
                                event={handleRemoveImage}
                            />
                        </form>
                    </Popup>
                )}
            </AnimatePresence>
        </>
    );
};
