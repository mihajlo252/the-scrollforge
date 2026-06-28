import { useEffect, useState } from "react";
import styles from "./Resources.module.css";

function createBoolArray(maxAmout: number, trues: number) {
  const arr = new Array(maxAmout).fill(false);

  arr.fill(true, 0, trues);

  return arr;
}

export const Resources = ({ children, columns, stat, max }: { children: React.ReactNode; columns: number; stat: number; max: number }) => {
  const [activeResources, setActiveResources] = useState<boolean[]>(createBoolArray(max, stat));

  const handleToggleResource = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.classList.toggle("stroke-primary");
    e.currentTarget.classList.toggle("stroke-secondary");
  };

  useEffect(() => {
    setActiveResources(createBoolArray(max, stat));
  }, [stat]);

  return (
    <li className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {activeResources.map((r, i) => (
        <div key={i} className={`${styles.cell} ${r ? "stroke-primary" : "stroke-accent"}`} onClick={r ? handleToggleResource : undefined}>
          {children}
        </div>
      ))}
    </li>
  );
};
