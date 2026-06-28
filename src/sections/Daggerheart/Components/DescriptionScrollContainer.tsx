import React, { useEffect, useRef } from "react";
import styles from "./DescriptionScrollContainer.module.css";

export const DescriptionScrollContainer = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [children]);
  return <div ref={scrollRef} className={styles.container}>{children}</div>;
};
