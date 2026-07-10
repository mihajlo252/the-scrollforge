import { Reorder, useDragControls } from "framer-motion";
import React from "react";
import { Icon } from "./Primitives";

/**
 * A single draggable row for a framer-motion <Reorder.Group>.
 *
 * Drag is initiated only from the grip handle (dragListener=false +
 * useDragControls), so clicks/edits on the rest of the row keep working.
 * The handle is rendered first; for grid rows it becomes the first column,
 * for flex rows it sits to the left of `children`.
 */
export function ReorderRow<T>({
	value,
	className,
	handleClassName,
	onCommit,
	children,
}: {
	value: T;
	className?: string;
	handleClassName?: string;
	onCommit?: () => void;
	children: React.ReactNode;
}) {
	const controls = useDragControls();
	return (
		<Reorder.Item
			value={value}
			as="div"
			className={className}
			dragListener={false}
			dragControls={controls}
			onDragEnd={onCommit}
		>
			<span
				className={handleClassName}
				role="button"
				aria-label="Drag to reorder"
				onPointerDown={(e) => {
					e.preventDefault();
					controls.start(e);
				}}
			>
				<Icon name="grip" size={14} stroke={2.4} />
			</span>
			{children}
		</Reorder.Item>
	);
}
