import { AnimatePresence, motion } from "framer-motion";
import React from "react";

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
        <div className="absolute  right-0 top-0 isolate z-50 box-border flex h-full w-full flex-col items-end justify-center gap-5 px-20 py-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0 }}
            className="margin-0 padding-0 absolute inset-0 z-[-1]"
            onClick={() => closerFunc(false)}
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, translateX: "20%" }}
            animate={{ opacity: 1, translateX: "0%" }}
            exit={{ opacity: 0, translateX: "20%" }}
            transition={{ duration: 0.35, delay: 0 }}
            className="margin-0 padding-0 absolute right-0 flex justify-center items-center top-o bg-base-300 bg-opacity-90 border-l-2 border-slate-900 h-full w-[30%]"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
