import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styles from "./AccountPopover.module.css";

export const AccountPopover = ({
	children,
	closerFunc,
	toggle,
}: {
	children: React.ReactNode;
	closerFunc: React.Dispatch<React.SetStateAction<boolean>>;
	toggle?: boolean;
}) => {
	// const [open, setOpen] = React.useState(false);

	return (
		<AnimatePresence>
			{toggle && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35, delay: 0 }}
						className={styles.backdrop}
						onClick={() => closerFunc(false)}
					></motion.div>
					<div className={styles.accountPopoverWrapper}>
						<motion.div
							initial={{ opacity: 0, y: -8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -8, scale: 0.96 }}
							transition={{ duration: 0.18, ease: "easeOut", delay: 0 }}
							className={`frame ${styles.accountPopover}`}
						>
							{children}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
};
