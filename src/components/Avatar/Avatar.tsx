import { useState } from "react";
import { Popup } from "../Popup/Popup";
import { supabase } from "../../supabase/supabase";
import { toast } from "../../utilities/toasterSonner";
import styles from "./Avatar.module.css";
import { AvatarIcon } from "../Primitives";

export const Avatar = ({ characterName, characterClass }: { characterName: string, characterClass: string }) => {
	const [imageSrc, setImageSrc] = useState<string>(
		import.meta.env.VITE_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + `characters/${characterName}.png`,
	);
	const [edit, setEdit] = useState(false);
	const [placeholder, setPlaceholder] = useState(false);

	const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const file = ((e.target as HTMLFormElement).elements[0] as HTMLInputElement).files?.[0];
		if (!file) return;
		if (file?.size > 307200) {
			toast({ style: "bg-error text-base-100", message: "File is too large! Please keep file size below 300KB." });
			return;
		}
		const { error } = await supabase.storage.from("characters").upload(`${characterName}.png`, file as File, { cacheControl: "0", upsert: true });
		if (error) {
			return;
		}
		setEdit(false);
		setImageSrc((prev) => `${prev}?t=${Date.now()}`);
		toast({ style: "bg-primary text-base-100", message: "Image changed!" });
	};

	const handleRemoveImage = async (e: React.MouseEvent) => {
		e.preventDefault();
		await supabase.storage.from("characters").remove([`${characterName}.png`]);
		setImageSrc((prev) => `${prev}?t=${Date.now()}`);
		setEdit(false);
		toast({ style: "bg-primary text-base-100", message: "Image removed!" });
	};

	return (
		<>
			<div className={`${styles.avatar}`}>
				{!placeholder ? (
					<img src={imageSrc} onError={() => setPlaceholder(true)} />
				) : (
					<div className={`${styles.placeholder}`}>
						<AvatarIcon name={"cleric"} size={64} fillClr="var(--accent)" strokeClr="var(--accent)" />
					</div>
				)}
				<button onClick={() => setEdit(true)}>
					<p>Edit</p>
				</button>
			</div>
			<Popup closerFunc={setEdit} toggle={edit}>
				<form onSubmit={handleSave} className="flex flex-col gap-5">
					<h2 className="mb-10 text-3xl text-accent">Upload Image</h2>
					<input
						type="file"
						accept="image/*"
						className="file-input file-input-bordered file-input-accent w-full max-w-xs flex-grow place-self-center"
					/>
					<div className="flex gap-2">
						<button type="submit" className="button button-accent">
							Save
						</button>
						<button
							type="button"
							className="button button-secondary"
							onClick={(e) => {
								e.preventDefault();
								setEdit(false);
							}}
						>
							Cancel
						</button>
					</div>
					<button type="button" className="button button-secondary button-ghost" onClick={handleRemoveImage}>
						Remove image
					</button>
				</form>
			</Popup>
		</>
	);
};
