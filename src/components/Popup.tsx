import { AnimatePresence, motion } from "framer-motion";
import React from "react";

export const Popup = ({
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
        <motion.div
          className="fixed left-0 top-0 isolate z-50 box-border flex h-full w-full flex-col items-center justify-center gap-5 px-20 py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0 }}
        >
          <div className="margin-0 padding-0 absolute inset-0 z-[-1] bg-black/80" onClick={() => closerFunc(false)}></div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
