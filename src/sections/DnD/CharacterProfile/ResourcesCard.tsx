import { Link } from "@tanstack/react-router";
import { Frame } from "../../../components/Frame/Frame";
import { Dots, Icon } from "../../../components/Primitives";
import { Capitalize } from "../../../utilities/capitalize";
import styles from "./sheet.module.css";

const COLORS: Record<string, string> = {
	purple: "var(--arcane)",
	pink: "#c97da0",
	white: "var(--ink-dim)",
	red: "var(--ember)",
	yellow: "var(--gold)",
	regular: "var(--gold-2)",
};

export const ResourcesCard = ({ character }: { character: Character }) => {
	const inspiration = character.stats.inspiration ?? {};
	const entries = Object.entries(inspiration).filter(([, count]) => (count as number) > 0) as [string, number][];

	return (
		<Frame classes="card">
			<div className="card-hdr">
				<div className="card-title">Resources</div>
				<Link to="/dnd/inspiration" className="sf-icon-btn" style={{ width: 28, height: 28 }} aria-label="Manage inspiration">
					<Icon name="plus" size={12} />
				</Link>
			</div>
			<div className={`card-body ${styles.resList}`}>
				{entries.length === 0 && (
					<div className="sf-resource-note">
						<Icon name="sparkle" size={12} /> No inspiration banked yet
					</div>
				)}
				{entries.map(([color, count]) => (
					<div key={color} className="sf-resource">
						<div className={styles.resHead}>
							<div>
								<div className={styles.resName}>{Capitalize(color)} Inspiration</div>
								<div className={styles.resSub}>{color === "regular" ? "standard" : "gemstone"}</div>
							</div>
							<div className={styles.resCount}>{count}</div>
						</div>
						<Dots total={Math.min(count, 10)} filled={Math.min(count, 10)} size={14} color={COLORS[color] ?? "var(--gold)"} />
					</div>
				))}
				<div className="sf-resource-note">
					<Icon name="moon" size={12} /> Long rest restores expended resources
				</div>
			</div>
		</Frame>
	);
};
