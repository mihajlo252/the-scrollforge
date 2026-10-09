import React, { useRef, useState } from "react";
import { Popup } from "./Popup/Popup";
import { Frame } from "./Frame/Frame";

/** A button that asks for confirmation in a popup before running its action.
 *  Drop-in replacement for destructive (delete) buttons so nothing is removed
 *  by accident. Any extra props (className, aria-label, …) pass to the button. */
export const ConfirmButton = ({
	onConfirm,
	children,
	title = "Delete this?",
	message = "This can't be undone.",
	confirmLabel = "Delete",
	...rest
}: {
	onConfirm: () => void;
	children: React.ReactNode;
	title?: string;
	message?: string;
	confirmLabel?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "type">) => {
	const [open, setOpen] = useState(false);
	// Confirmed, waiting for the popup to finish closing before onConfirm runs.
	// (onConfirm often deletes the row this button sits in, which would unmount
	// the popup before its close animation could play.)
	const confirmed = useRef(false);

	return (
		<>
			<button type="button" onClick={() => setOpen(true)} {...rest}>
				{children}
			</button>
			<Popup
				toggle={open}
				closerFunc={setOpen}
				onExitComplete={() => {
					if (!confirmed.current) return;
					confirmed.current = false;
					onConfirm();
				}}
			>
				<Frame classes="column-direction">
					<h3 className="card-title">{title}</h3>
					<p className="text-content">{message}</p>
					<div className="side-by-side">
						<button
							type="button"
							className="button button-primary stretch"
							onClick={() => {
								confirmed.current = true;
								setOpen(false);
							}}
						>
							{confirmLabel}
						</button>
						<button type="button" className="button button-secondary stretch" onClick={() => setOpen(false)}>
							Cancel
						</button>
					</div>
				</Frame>
			</Popup>
		</>
	);
};
