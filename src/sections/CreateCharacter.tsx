import React, { useState } from "react";
import { getUserFromLocal } from "../utilities/getUserFromLocal";
import { submitCharacter } from "../utilities/submitCharacter";
import { DNDForm } from "./DnD/CreateCharacter/DNDForm";
import { DaggerheartForm } from "./Daggerheart/CreateCharacter/DaggerheartForm";
import { motion } from "framer-motion";
import { Icon } from "../components/Primitives";
export const CreateCharacter = ({
	openCreateCharacter,
	setOpenCreateCharacter,
	setIsSave,
	gameMode,
	setGameMode,
}: {
	openCreateCharacter: boolean;
	setOpenCreateCharacter: React.Dispatch<React.SetStateAction<boolean>>;
	setIsSave: React.Dispatch<React.SetStateAction<boolean>>;
	gameMode: string;
	setGameMode: React.Dispatch<React.SetStateAction<string>>;
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

	const handleCreateCharacter = async (e: React.FormEvent) => {
		e.preventDefault();
		const { user } = JSON.parse(getUserFromLocal());
		// await submitCharacter(characterProfile, user.id, gameMode);
		if (gameMode === "dnd") await submitCharacter(characterProfile, user.id, gameMode);
		if (gameMode === "daggerheart") await submitCharacter(characterProfileDaggerheart, user.id, gameMode);
		setIsSave(true);
		setOpenCreateCharacter(false);
	};

	return (
		<>
			{gameMode === "dnd" && (
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
					className="frame full column-direction"
				>
					<DNDForm
						setCharacterProfile={setCharacterProfile}
						characterProfile={characterProfile}
						handleCreateCharacter={handleCreateCharacter}
					>
						<div className="side-by-side">
							<button type="button" className="button button-primary" onClick={() => setGameMode("")}>
								<Icon name="back" size={13} />
							</button>

							<button type="submit" className="button button-primary stretch">
								Create
							</button>
							<button
								type="button"
								className="button button-secondary stretch"
								onClick={() => {
									setGameMode("");
									setOpenCreateCharacter(false);
								}}
							>
								Cancel
							</button>
						</div>
					</DNDForm>
				</motion.section>
			)}
			{gameMode === "daggerheart" && (
				<motion.section
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
					className="frame full"
				>
					<DaggerheartForm
						setCharacterProfileDaggerheart={setCharacterProfileDaggerheart}
						characterProfileDaggerheart={characterProfileDaggerheart}
						handleCreateCharacter={handleCreateCharacter}
					>
						<div className="side-by-side">
							<button type="button" className="button button-primary" onClick={() => setGameMode("")}>
								<Icon name="back" size={13} />
							</button>

							<button type="submit" className="button button-primary stretch">
								Create
							</button>
							<button
								type="button"
								className="button button-secondary stretch"
								onClick={() => {
									setGameMode("");
									setOpenCreateCharacter(false);
								}}
							>
								Cancel
							</button>
						</div>
					</DaggerheartForm>
				</motion.section>
			)}
		</>
	);
};
