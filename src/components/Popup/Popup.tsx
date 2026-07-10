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
				>
					<div className={styles.backdrop} onClick={() => closerFunc(false)}></div>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
};
