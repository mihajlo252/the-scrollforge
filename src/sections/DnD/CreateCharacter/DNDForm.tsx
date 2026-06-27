import React from "react";

export const DNDForm = ({
	children,
	setCharacterProfile,
	characterProfile,
	handleCreateCharacter,
}: {
	children: React.ReactNode;
	setCharacterProfile: React.Dispatch<React.SetStateAction<CharacterProfile>>;
	characterProfile: CharacterProfile;
	handleCreateCharacter: (e: React.FormEvent) => Promise<void>;
}) => {
	return (
		<>
			<h3><span className="small-eyebrow text-primary text-content">Quick start</span>Forge Your Hero</h3>
			<form className="form column-direction" onSubmit={(e) => handleCreateCharacter(e)}>
				<div className="inputWrapper">
					<label htmlFor="name">Name: </label>
					<input
						type="text"
						className="input text-content"
						placeholder="Chose a name for your character..."
						name="name"
            id="name"
						required
						autoFocus
						onChange={(e) => setCharacterProfile({ ...characterProfile, name: e.target.value })}
					/>
				</div>
				<section className="wrapped">
					<div className="inputWrapper">
						<label htmlFor="level">Level: </label>
						<input
							type="number"
							className="input text-content"
							placeholder="Set character level..."
							name="level"
							id="level"
							required
							onChange={(e) => setCharacterProfile({ ...characterProfile, level: parseInt(e.target.value) })}
						/>
					</div>
					<div className="inputWrapper">
						<label htmlFor="class">Class: </label>
						<input
							type="text"
							className="input text-content"
							placeholder="Set character class..."
							name="class"
							id="class"
							required
							onChange={(e) => setCharacterProfile({ ...characterProfile, class: e.target.value })}
						/>
					</div>
					<div className="inputWrapper">
						<label htmlFor="subclass">Subclass: </label>
						<input
							type="text"
							className="input text-content"
							placeholder="Set character subclass..."
							name="subclass"
							id="subclass"
							onChange={(e) => setCharacterProfile({ ...characterProfile, subclass: e.target.value })}
						/>
					</div>
					<div className="inputWrapper">
						<label htmlFor="race">Race: </label>
						<input
							type="text"
							className="input text-content"
							placeholder="Set character race..."
							name="race"
							id="race"
							required
							onChange={(e) => setCharacterProfile({ ...characterProfile, race: e.target.value })}
						/>
					</div>
					<div className="inputWrapper">
						<label htmlFor="subrace">Subrace: </label>
						<input
							type="text"
							className="input text-content"
							placeholder="Set character subrace..."
							name="subrace"
							id="subrace"
							onChange={(e) => setCharacterProfile({ ...characterProfile, subrace: e.target.value })}
						/>
					</div>
				</section>
				{children}
			</form>
		</>
	);
};
