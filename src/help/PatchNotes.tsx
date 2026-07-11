import { useMemo, type Dispatch, type SetStateAction } from "react";
import { marked } from "marked";
import { Frame } from "../components/Frame/Frame";
import { Popup } from "../components/Popup/Popup";
import { Icon } from "../components/Primitives";
import { patchNotesBody } from "./patchNotesData";
import help from "./HelpCenter.module.css";
import styles from "./PatchNotes.module.css";

marked.setOptions({ breaks: true, gfm: true });

export const PatchNotes = ({
	toggle,
	closerFunc,
}: {
	toggle: boolean;
	closerFunc: Dispatch<SetStateAction<boolean>>;
}) => {
	const html = useMemo(() => marked.parse(patchNotesBody) as string, []);

	return (
		<Popup closerFunc={closerFunc} toggle={toggle}>
			<Frame classes={`column-direction ${styles.frame}`}>
				<div className={styles.header}>
					<div className="card-title">What's New</div>
					<button type="button" className="sf-icon-btn" onClick={() => closerFunc(false)} aria-label="Close patch notes">
						<Icon name="close" size={16} />
					</button>
				</div>
				<div className={`text-content ${help.markdown} ${styles.body}`} dangerouslySetInnerHTML={{ __html: html }} />
				<button type="button" className="button button-primary" onClick={() => closerFunc(false)}>
					Got it
				</button>
			</Frame>
		</Popup>
	);
};

export default PatchNotes;
