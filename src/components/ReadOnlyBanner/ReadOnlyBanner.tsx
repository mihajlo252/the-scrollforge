import { useNavigate } from "@tanstack/react-router";
import { Icon } from "../Primitives";
import styles from "./ReadOnlyBanner.module.css";

// Shown on a character sheet while a GM is viewing another player's character.
// All edits are blocked (see the write-block in autosaveCharacter/patchCharacter)
// except adding items to the inventory.
export const ReadOnlyBanner = () => {
	const navigate = useNavigate();
	return (
		<div className={styles.banner}>
			<span className={styles.icon}>
				<Icon name="eye" size={16} />
			</span>
			<div className={styles.text}>
				<b>Viewing as GM — read-only.</b>
				<span>You can still add items to this character’s inventory.</span>
			</div>
			<button type="button" className={`button ${styles.back}`} onClick={() => navigate({ to: "/campaigns/detail" })}>
				<Icon name="back" size={13} />
				Back to campaign
			</button>
		</div>
	);
};
