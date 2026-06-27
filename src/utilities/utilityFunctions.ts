export function activeButtonsToggle(e: any) {
	const activeButtonNodes = e!.currentTarget!.parentNode!.querySelectorAll(`.button[data-active]`);
	const activeButtons = Array.from(activeButtonNodes);
	activeButtons.forEach((b: any) => {
		b.setAttribute("data-active", "false");
	});
	e!.currentTarget!.setAttribute("data-active", "true");
}

export function getRandomGreeting(): string {
	const greetingsByCategory = {
		tavern: [
			"Well met, ",
			"Pull up a chair by the hearth, ",
			"A round of ale for ",
			"Rest your weary feet, ",
			"The tavern is livelier with you here, ",
			"The bard's song grows merrier with you here, ",
			"Your usual table is waiting, ",
			"The fire burns brighter with your arrival, ",
			"Come, warm yourself by the fire, ",
			"The innkeeper saved you a room, ",
		],
		epic: [
			"Hail, ",
			"The chronicles await your return, ",
			"Greetings, Brave Adventurer ",
			"Your legend continues, ",
			"Enter the halls of heroes, ",
			"The stars have foretold your coming, ",
			"Destiny stirs with your arrival, ",
			"The realm rejoices at your return, ",
			"Ancient prophecies speak of one such as you, ",
			"The gods themselves take notice of your deeds, ",
		],
		action: [
			"Ready your gear, ",
			"Adventure calls, ",
			"Your party awaits, ",
			"Prepare for the journey, ",
			"To arms, ",
			"Sharpen your blades, ",
			"The quest board has new bounties, ",
			"Danger lurks around every corner, ",
			"Your map awaits, ",
			"The dungeon won't clear itself, ",
		],
		meta: [
			"Natural 20 on your Login, ",
			"Roll for initiative, ",
			"Leveling up again, ",
			"You've successfully tracked down your profile, ",
			"Inventory check time, ",
			"Critical hit on the login button, ",
			"Perception check passed, ",
			"Your character sheet is loaded, ",
			"No saving throw required to log in, ",
			"Rolled a wisdom check on your password, ",
		],
	};

	const categoryWeights: Record<keyof typeof greetingsByCategory, number> = {
		tavern: 8,
		epic: 4,
		action: 2,
		meta: 1,
	};
	// Build a weighted pool of category keys
	const pool = (Object.keys(categoryWeights) as Array<keyof typeof categoryWeights>).flatMap((category) =>
		Array(categoryWeights[category]).fill(category),
	);

	// Pick a random category from the pool
	const selectedCategory: keyof typeof greetingsByCategory = pool[Math.floor(Math.random() * pool.length)];

	// Pick a random greeting from that category
	const greetings = greetingsByCategory[selectedCategory];
	return greetings[Math.floor(Math.random() * greetings.length)];
}
