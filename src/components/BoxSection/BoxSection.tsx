import { motion } from "framer-motion";
import styles from "./BoxSection.module.css";

export const BoxSection = ({ classes, hoverable, children }: { classes?: string; hoverable?: boolean; children: React.ReactNode }) => {
  return (
    <motion.section tabIndex={hoverable ? 0 : -1} aria-label="Character Card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`boxSection ${hoverable && styles.hoverableCard} ${classes} `}>
      {children}
    </motion.section>
  );
};
