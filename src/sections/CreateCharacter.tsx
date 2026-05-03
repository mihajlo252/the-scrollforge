import React, { useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { submitCharacter, submitDaggerheartCharacter, submitDndCharacter } from "../utilities/submitCharacter";
import { DNDForm } from "./DnD/CreateCharacter/DNDForm";
import { DaggerheartForm } from "./Daggerheart/CreateCharacter/DaggerheartForm";

export const CreateCharacter = ({
	openCreateCharacter,
	setOpenCreateCharacter,
	setIsSave,
	gameMode,
}: {
	openCreateCharacter: boolean;
	setOpenCreateCharacter: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
	gameMode: string;
}) => {
	if (!openCreateCharacter) return;

	const [characterProfile, setCharacterProfile] = useState<CharacterProfile>({
		class: "",
		level: 0,
		name: "",
		race: "",
		subclass: "",
		subrace: "",
	});
	const [characterProfileDaggerheart, setCharacterProfileDaggerheart] = useState<CharacterProfileDaggerheart>({
		name: "",
		class: "",
		domains: "",
		level: 0,
		ancestry: "",
		community: "",
		subclass: "",
	});
	const [daggerheartName, setDaggerheartName] = useState<string>("");

	const handleCreateCharacter = async (e: React.FormEvent) => {
		e.preventDefault();
		const { user } = JSON.parse(getUserFromLocal());
		await submitCharacter(characterProfile, user.id, gameMode);
		// if (gameMode === "dnd") await submitDndCharacter(characterProfile, user.id, gameMode);
		// if (gameMode === "daggerheart") await submitDaggerheartCharacter(daggerheartName, characterProfileDaggerheart, user.id, gameMode);
		setIsSave(true);
		setOpenCreateCharacter(false);
	};

	return (
		<>
			{gameMode === "dnd" && (
				<DNDForm setCharacterProfile={setCharacterProfile} characterProfile={characterProfile} handleCreateCharacter={handleCreateCharacter}>
					<div className="mt-10 flex gap-2">
						<button type="submit" className="btn btn-primary flex-1">
							Create
						</button>
						<button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
							Cancel
						</button>
					</div>
				</DNDForm>
			)}
			{gameMode === "daggerheart" && (
				<DaggerheartForm
					setCharacterProfileDaggerheart={setCharacterProfileDaggerheart}
					characterProfileDaggerheart={characterProfileDaggerheart}
					handleCreateCharacter={handleCreateCharacter}
					setDaggerheartName={setDaggerheartName}
				>
					<div className="mt-10 flex gap-2 col-span-4">
						<button type="submit" className="btn btn-primary flex-1">
							Create
						</button>
						<button type="button" className="btn btn-secondary flex-1" onClick={() => setOpenCreateCharacter(false)}>
							Cancel
						</button>
					</div>
				</DaggerheartForm>
			)}
		</>
	);
};
