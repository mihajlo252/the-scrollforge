import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { forwardRef, useRef } from "react";
import { Icon } from "../Primitives";
import styles from "./SortableGrid.module.css";

/**
 * Drag-to-reorder for items laid out in a (wrapping) CSS grid — no extra deps.
 *
 * framer-motion's Reorder is single-axis only, so this works differently:
 * on drag start we snapshot the grid CELL rects (their on-screen positions are
 * fixed while dragging). As the pointer moves we find which cell it's over and
 * move the dragged item to that index; `layout` animates the others into place.
 * Drag is started from a grip handle so the card stays clickable.
 */
export function SortableGrid<T>({
	items,
	getId,
	onReorder,
	onCommit,
	className,
	itemClassName,
	renderItem,
}: {
	items: T[];
	getId: (item: T) => string;
	onReorder: (next: T[]) => void;
	onCommit?: () => void;
	className?: string;
	itemClassName?: string;
	renderItem: (item: T) => React.ReactNode;
}) {
	const containerRef = useRef<HTMLUListElement>(null);
	const cellRects = useRef<DOMRect[]>([]);
	const itemsRef = useRef(items);
	itemsRef.current = items;

	const measure = () => {
		const el = containerRef.current;
		cellRects.current = el ? Array.from(el.children).map((c) => c.getBoundingClientRect()) : [];
	};

	const onItemDrag = (id: string, point: { x: number; y: number }) => {
		const rects = cellRects.current;
		let target = -1;
		for (let i = 0; i < rects.length; i++) {
			const r = rects[i];
			if (point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom) {
				target = i;
				break;
			}
		}
		if (target < 0) return;
		const cur = itemsRef.current;
		const from = cur.findIndex((it) => getId(it) === id);
		if (from < 0 || from === target) return;
		const next = [...cur];
		const [moved] = next.splice(from, 1);
		next.splice(target, 0, moved);
		onReorder(next);
	};

	return (
		<ul ref={containerRef} className={className}>
			{/* initial={false} → no animation on first mount (calm page load);
			    additions/removals/reorders still animate. */}
			<AnimatePresence mode="popLayout" initial={false}>
				{items.map((item) => {
					const id = getId(item);
					return (
						<SortableItem
							key={id}
							className={itemClassName}
							onStart={measure}
							onDrag={(info) => onItemDrag(id, info.point)}
							onEnd={() => onCommit?.()}
						>
							{renderItem(item)}
						</SortableItem>
					);
				})}
			</AnimatePresence>
		</ul>
	);
}

const SortableItem = forwardRef<HTMLLIElement, {
	className?: string;
	onStart: () => void;
	onDrag: (info: PanInfo) => void;
	onEnd: () => void;
	children: React.ReactNode;
}>(({ className, onStart, onDrag, onEnd, children }, ref) => {
	const controls = useDragControls();
	return (
		<motion.li
			ref={ref}
			layout
			drag
			dragControls={controls}
			dragListener={false}
			dragSnapToOrigin
			dragElastic={0.12}
			onDragStart={onStart}
			onDrag={(_, info) => onDrag(info)}
			onDragEnd={onEnd}
			whileDrag={{ scale: 1.03, zIndex: 5 }}
			initial={{ opacity: 0, scale: 0.96 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.96 }}
			transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
			className={`${styles.item} ${className ?? ""}`}
		>
			<button
				type="button"
				className={styles.handle}
				onPointerDown={(e) => {
					e.preventDefault();
					controls.start(e);
				}}
				aria-label="Drag to reorder"
			>
				<Icon name="grip" size={16} />
			</button>
			{children}
		</motion.li>
	);
});
