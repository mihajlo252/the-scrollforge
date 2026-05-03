export function activeButtonsToggle(e: any) {
	const activeButtonNodes = e!.currentTarget!.parentNode!.querySelectorAll(`.button[data-active]`);
	const activeButtons = Array.from(activeButtonNodes);
	activeButtons.forEach((b: any) => {
		b.setAttribute("data-active", "false");
	});
	e!.currentTarget!.setAttribute("data-active", "true");
}
