import { motion } from "framer-motion";
import React from "react";

export const Popup = ({children, closerFunc} : {children: React.ReactNode, closerFunc: React.Dispatch<React.SetStateAction<boolean>>}) => {
    return (
        <motion.div
                    className="fixed left-0 top-0 isolate z-50 box-border flex h-full w-full flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="margin-0 padding-0 absolute inset-0 z-[-1] bg-black/80" onClick={() => closerFunc(false)}></div>
            {children}
        </motion.div>
    );
};
