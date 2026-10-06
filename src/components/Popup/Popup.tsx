import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import styles from "./Popup.module.css";

export const Popup = ({
	children,
	closerFunc,
	toggle,
}: {
	children: React.ReactNode;
	closerFunc: React.Dispatch<React.SetStateAction<boolean>>;
	toggle?: boolean;
}) => {

	useEffect(() => {

		const handleClosePopup = (e: KeyboardEvent) => {
			if (e.key == "Escape") {
				closerFunc(false);
			}
		};

		window.addEventListener("keyup", handleClosePopup);

		return () => {
			window.removeEventListener("keyup", handleClosePopup);
		};
	}, []);

	return (
		<AnimatePresence>
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
