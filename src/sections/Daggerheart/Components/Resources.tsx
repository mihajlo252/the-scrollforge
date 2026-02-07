import React, { useEffect, useState } from "react";

function createBoolArray(maxAmout: number, trues: number) {
  const arr = new Array(maxAmout).fill(false);

  arr.fill(true, 0, trues);

  return arr;
}

export const Resources = ({ children, styles, stat, max }: { children: React.ReactNode, styles: string, stat: number, max: number }) => {
  const [activeResources, setActiveResources] = useState<boolean[]>(createBoolArray(max, stat));

  const handleToggleResource = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.classList.toggle("stroke-primary");
    e.currentTarget.classList.toggle("stroke-secondary");
  };

  useEffect(() => {
    setActiveResources(createBoolArray(max, stat))
  }, [stat])

  return (
    <li className={`grid gap-2 hover:cursor-pointer ${styles}`}>
      {activeResources.map((r, i) => {
        // console.log(r);
        if (r === true) {
          return (
            <div key={i} className={`stroke-primary`} onClick={handleToggleResource}>
              {children}
            </div>
          );
        } else {
          return (
            <div key={i} className={`stroke-accent`}>
              {children}
            </div>
          );
        }
      })}
    </li>
  );
};
