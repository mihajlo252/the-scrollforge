import { domainColor } from "../../../utilities/daggerheart";
import styles from "./DomainCard.module.css";

export const DomainCardView = ({ card, children }: { card: DomainCard; children?: React.ReactNode }) => {
	const color = domainColor(card.domain);
	return (
		<div className={styles.card}>
			<span className={styles.stripe} style={{ background: color }} />
			<div className={styles.head}>
				<span className={styles.recall} title="Recall cost">{card.recall}</span>
				<div className={styles.titleWrap}>
					<span className={styles.name}>{card.name}</span>
					<span className={styles.meta}>
						<span className={styles.domainTag} style={{ color }}>{card.domain}</span>
						<span>· Lv {card.level}</span>
						<span>· {card.type}</span>
					</span>
				</div>
			</div>
			<div className={styles.text}>{card.text}</div>
			{children && <div className={styles.actions}>{children}</div>}
		</div>
	);
};
