import styles from "./StatBlock.module.css";

export const StatBlock = ({ children, name, stat, color }: { children: React.ReactNode; name: string; stat: number; color: string }) => {
  return (
    <div className={styles.block}>
      <p className={styles.value}>{stat}</p>
      <div className={styles.icon}>{children}</div>
      <p className={styles.label} style={{ backgroundColor: `var(--${color})` }}>
        {name}
      </p>
    </div>
  );
};
