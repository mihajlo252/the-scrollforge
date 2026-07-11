import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useRouterState } from "@tanstack/react-router";
import { marked } from "marked";
import { Frame } from "../components/Frame/Frame";
import { Popup } from "../components/Popup/Popup";
import { Icon } from "../components/Primitives";
import { helpGroups, topicById, topicIdForPath, type HelpTopic } from "./helpTopics";
import styles from "./HelpCenter.module.css";

marked.setOptions({ breaks: true, gfm: true });

export const HelpCenter = ({
	toggle,
	closerFunc,
}: {
	toggle: boolean;
	closerFunc: Dispatch<SetStateAction<boolean>>;
}) => {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [activeId, setActiveId] = useState("general-welcome");
	const [query, setQuery] = useState("");
	// On narrow screens the list and reader are separate views; this flips between them.
	const [reading, setReading] = useState(false);

	// Each time the panel opens, land on the topic for the screen behind it.
	useEffect(() => {
		if (toggle) {
			setActiveId(topicIdForPath(pathname));
			setQuery("");
			setReading(false);
		}
	}, [toggle, pathname]);

	const q = query.trim().toLowerCase();
	const groups = useMemo(() => {
		if (!q) return helpGroups;
		return helpGroups
			.map((g) => ({ ...g, topics: g.topics.filter((t) => t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)) }))
			.filter((g) => g.topics.length > 0);
	}, [q]);

	const active: HelpTopic | undefined = topicById(activeId);
	const html = useMemo(() => (active ? (marked.parse(active.body) as string) : ""), [active]);

	// Start each topic at the top rather than inheriting the last one's scroll.
	const readerRef = useRef<HTMLElement>(null);
	useEffect(() => {
		readerRef.current?.scrollTo(0, 0);
	}, [activeId]);

	const openTopic = (id: string) => {
		setActiveId(id);
		setReading(true);
	};

	return (
		<Popup closerFunc={closerFunc} toggle={toggle}>
			<Frame classes={`column-direction ${styles.frame}`}>
				<div className={styles.header}>
					<div className="card-title">Guide</div>
					<div className={styles.search}>
						<Icon name="search" size={15} />
						<input
							className="input"
							placeholder="Search the guide…"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							aria-label="Search the guide"
						/>
					</div>
					<button type="button" className="sf-icon-btn" onClick={() => closerFunc(false)} aria-label="Close guide">
						<Icon name="close" size={16} />
					</button>
				</div>

				<div className={styles.body} data-reading={reading ? "" : undefined}>
					<nav className={styles.list} aria-label="Guide topics">
						{groups.length === 0 && <div className={styles.empty}>No topics match “{query}”.</div>}
						{groups.map((g) => (
							<div key={g.label} className={styles.group}>
								<span className="caps">{g.label}</span>
								{g.topics.map((t) => (
									<button
										key={t.id}
										type="button"
										className={styles.topicBtn}
										data-active={t.id === activeId ? "" : undefined}
										onClick={() => openTopic(t.id)}
									>
										{t.title}
									</button>
								))}
							</div>
						))}
					</nav>

					<article className={styles.reader} ref={readerRef}>
						<button type="button" className={`button button-ghost short ${styles.backBtn}`} onClick={() => setReading(false)}>
							<Icon name="back" size={14} /> Topics
						</button>
						{active ? (
							<div className={`text-content ${styles.markdown}`} dangerouslySetInnerHTML={{ __html: html }} />
						) : (
							<div className={styles.empty}>Select a topic to read.</div>
						)}
					</article>
				</div>
			</Frame>
		</Popup>
	);
};

export default HelpCenter;
