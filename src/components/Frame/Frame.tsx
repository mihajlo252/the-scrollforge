import { motion } from "framer-motion";
import styles from "./Frame.module.css";

export const Frame = ({ classes, hoverable, children }: { classes?: string; hoverable?: boolean; children: React.ReactNode }) => {
	return (
		<motion.section
			tabIndex={hoverable ? 0 : -1}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={`frame ${hoverable && styles.hoverableCard} ${classes} `}
		>
			{children}
		</motion.section>
	);
};
