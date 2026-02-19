import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styles from "./SideMenu.module.css"

export const SideMenu = ({
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
        <div className={styles.sideMenuWrapper}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0 }}
            className={styles.backdrop}
            onClick={() => closerFunc(false)}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, translateX: "20%" }}
            animate={{ opacity: 1, translateX: "0%" }}
            exit={{ opacity: 0, translateX: "20%" }}
            transition={{ duration: 0.35, delay: 0 }}
            className={`boxSection ${styles.sideMenu}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
