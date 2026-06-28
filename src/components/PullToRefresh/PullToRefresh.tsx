import { useEffect, useRef, useState } from "react";
import { Icon } from "../Primitives";
import styles from "./PullToRefresh.module.css";

const THRESHOLD = 70; // px pull (after resistance) needed to trigger
const MAX = 120; // max indicator travel
const RESISTANCE = 0.5; // drag-to-travel ratio (rubber-band feel)

/**
 * Custom pull-to-refresh for the app's scroll container. The document is
 * locked (overflow hidden) and the app runs as a standalone PWA, so the
 * browser's native pull-to-refresh isn't available — this recreates it.
 *
 * Attach to the scroll container via `containerRef`. Renders a fixed,
 * pointer-events-none indicator that follows the pull and spins while
 * refreshing. Defaults to a full reload, matching the native gesture.
 */
export const PullToRefresh = ({
	containerRef,
	onRefresh,
}: {
	containerRef: React.RefObject<HTMLElement | null>;
	onRefresh?: () => void;
}) => {
	const [pull, setPull] = useState(0);
	const [refreshing, setRefreshing] = useState(false);
	const [dragging, setDragging] = useState(false);

	const pullRef = useRef(0);
	const startY = useRef<number | null>(null);
	const refreshingRef = useRef(false);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const set = (v: number) => {
			pullRef.current = v;
			setPull(v);
		};

		const onStart = (e: TouchEvent) => {
			if (refreshingRef.current) return;
			if (el.scrollTop <= 0) {
				startY.current = e.touches[0].clientY;
			} else {
				startY.current = null;
			}
		};

		const onMove = (e: TouchEvent) => {
			if (startY.current === null || refreshingRef.current) return;
			const dy = e.touches[0].clientY - startY.current;
			if (dy > 0 && el.scrollTop <= 0) {
				e.preventDefault();
				setDragging(true);
				set(Math.min(MAX, dy * RESISTANCE));
			} else if (dy <= 0) {
				// user scrolled back up / past top — cancel
				startY.current = null;
				setDragging(false);
				set(0);
			}
		};

		const onEnd = () => {
			if (startY.current === null) return;
			startY.current = null;
			setDragging(false);
			if (pullRef.current >= THRESHOLD) {
				refreshingRef.current = true;
				setRefreshing(true);
				set(THRESHOLD);
				const doRefresh = onRefresh ?? (() => window.location.reload());
				// brief beat so the spinner is visible before the reload
				setTimeout(doRefresh, 350);
			} else {
				set(0);
			}
		};

		el.addEventListener("touchstart", onStart, { passive: true });
		el.addEventListener("touchmove", onMove, { passive: false });
		el.addEventListener("touchend", onEnd, { passive: true });
		el.addEventListener("touchcancel", onEnd, { passive: true });
		return () => {
			el.removeEventListener("touchstart", onStart);
			el.removeEventListener("touchmove", onMove);
			el.removeEventListener("touchend", onEnd);
			el.removeEventListener("touchcancel", onEnd);
		};
	}, [containerRef, onRefresh]);

	const progress = Math.min(1, pull / THRESHOLD);

	return (
		<div
			className={styles.wrap}
			style={{
				transform: `translateX(-50%) translateY(${pull}px)`,
				opacity: refreshing ? 1 : progress,
				transition: dragging ? "none" : "transform 0.25s ease, opacity 0.2s ease",
			}}
			aria-hidden
		>
			<div className={`${styles.badge} ${refreshing ? styles.spinning : ""}`}>
				<span
					className={styles.icon}
					style={{ transform: refreshing ? undefined : `rotate(${progress * 270}deg)` }}
				>
					<Icon name="refresh" size={18} />
				</span>
			</div>
		</div>
	);
};
