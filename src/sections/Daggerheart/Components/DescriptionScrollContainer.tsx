import React from "react";

export const DescriptionScrollContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="pr-2 flex flex-col gap-4 overflow-y-scroll h-[400px] max-[1023px]:h-[180px] min-[1440px]:h-[500px]">{children}</div>;
};
