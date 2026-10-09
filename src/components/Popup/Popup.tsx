import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styles from "./Popup.module.css";

// Open popups, oldest first. Escape only closes the topmost one, so a popup
// opened from inside another (e.g. the glyph picker over Forge a Campaign)
// doesn't take its parent down with it.
const openStack: symbol[] = [];

export const Popup = ({
	children,
	closerFunc,
	toggle,
	onExitComplete,
}: {
	children: React.ReactNode;
	closerFunc: React.Dispatch<React.SetStateAction<boolean>>;
	toggle?: boolean;
	/** Runs once the close animation has finished. Use it for anything that
	 *  would unmount this Popup's owner (deleting the row it lives in,
	 *  navigating away) — doing that immediately cuts the fade-out short. */
	onExitComplete?: () => void;
}) => {

	const id = useRef(Symbol("popup")).current;
	const closeRef = useRef(closerFunc);
	closeRef.current = closerFunc;

	useEffect(() => {
		if (!toggle) return;
		openStack.push(id);

		const handleClosePopup = (e: KeyboardEvent) => {
			if (e.key == "Escape" && openStack[openStack.length - 1] === id) {
				closeRef.current(false);
			}
		};

		window.addEventListener("keyup", handleClosePopup);

		return () => {
			window.removeEventListener("keyup", handleClosePopup);
			const i = openStack.lastIndexOf(id);
			if (i >= 0) openStack.splice(i, 1);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [toggle]);

	// Keep this Popup mounted while it closes: an owner that unmounts it with
	// the toggle (e.g. `{open && <Thing />}`) skips the exit animation.
	return (
		<AnimatePresence onExitComplete={onExitComplete}>
			{toggle && (
				<motion.div
					key="popup"
					className={styles.popupWrapper}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
					// Force framer-motion's main-thread (rAF) animator instead of the
					// accelerated Web Animations API path. The WAAPI path removes its
					// effect one frame before React unmounts the node, reverting opacity
					// to its inline base of 1 for that frame — a full-opacity flash on
					// close. The rAF animator writes opacity to the inline style each
					// frame and leaves the final value in place, so there's no flash.
					onUpdate={() => {}}
				>
					<div className={styles.backdrop} onClick={() => closerFunc(false)}></div>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
