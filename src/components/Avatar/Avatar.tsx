import styles from "./Avatar.module.css";
import { AvatarIcon } from "../Primitives";

export const Avatar = ({
	characterClass,
	gameMode,
}: {
	characterClass: string;
	gameMode: string;
}) => {
	return (
		<>
			<div className={`${styles.avatar}`}>
				<div className={`${gameMode === "dnd" ? styles.dnd : styles.dh} ${styles.imageContainer}`}>
					<AvatarIcon
						name={characterClass.toLowerCase()}
						size={80}
						fillClr="oklch(from var(--accent) calc(l - 0.3) c h)"
						strokeClr="var(--accent)"
					/>
				</div>
			</div>
		</>
	);
};
