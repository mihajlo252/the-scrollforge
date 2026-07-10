/**
 * Merge a reordered subset back into the full list.
 *
 * `visibleNewOrder` is the visible (filtered/grouped) items in their new order.
 * They are written back into the positions the visible items occupied in
 * `full`, in the new order. Items that aren't visible keep their positions.
 */
export function mergeReorder<T>(full: T[], visibleNewOrder: T[], isVisible: (item: T) => boolean): T[] {
	const result = [...full];
	const positions: number[] = [];
	full.forEach((item, i) => {
		if (isVisible(item)) positions.push(i);
	});
	positions.forEach((pos, k) => {
		result[pos] = visibleNewOrder[k];
	});
	return result;
}

/**
 * Stable per-object key for React lists that are reordered (e.g. drag-and-drop).
 * Keying by array index makes React reconcile by position, which fights
 * framer-motion's drag transform and causes flicker. This assigns a stable id
 * to each object reference so the key follows the item, not its position.
 */
const keyMap = new WeakMap<object, number>();
let keyCounter = 0;
export function stableKey(obj: object): number {
	let id = keyMap.get(obj);
	if (id === undefined) {
		id = ++keyCounter;
		keyMap.set(obj, id);
	}
	return id;
}
