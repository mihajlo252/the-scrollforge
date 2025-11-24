import React, { useEffect, useRef } from "react";

export const DescriptionScrollContainer = ({ children }: { children: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [children]);
  return <div ref={scrollRef} className="pr-2 flex flex-col gap-4 overflow-y-scroll h-[400px] max-[1023px]:h-[180px] min-[1440px]:h-[500px] scroll-smooth">{children}</div>;
};
