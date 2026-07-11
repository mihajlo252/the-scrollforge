import { useEffect, useRef } from "react";

interface Options {
	/** Buffer before auto-repeat kicks in, so a normal tap fires just once. */
	initialDelay?: number;
	/** Steady pace of the repeat once it starts — kept slow enough to stay usable. */
	interval?: number;
	/** Runs once when the interaction ends (pointer released / left / cancelled). */
	onRelease?: () => void;
}

/**
 * Press-and-hold auto-repeat for a button. Fires `action` immediately on press,
 * then — if the press is held past `initialDelay` — repeats it every `interval`
 * ms until release. Keyboard activation (Enter/Space) fires `action` once via the
 * returned `onClick`, and the pointer path suppresses that click so a mouse/touch
 * interaction is never counted twice.
 *
 * Spread the returned object onto a <button>.
 */
export const useHoldRepeat = (action: () => void, { initialDelay = 400, interval = 140, onRelease }: Options = {}) => {
	const actionRef = useRef(action);
	actionRef.current = action;
	const releaseRef = useRef(onRelease);
	releaseRef.current = onRelease;

	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const intervalRef = useRef<ReturnType<typeof setInterval>>();
	const activeRef = useRef(false);
	// True while a pointer is driving the interaction, so the trailing synthetic
	// click can be ignored (it would otherwise double-fire on mouse/touch).
	const pointerRef = useRef(false);

	const clearTimers = () => {
		clearTimeout(timeoutRef.current);
		clearInterval(intervalRef.current);
	};

	const stop = () => {
		if (!activeRef.current) return;
		activeRef.current = false;
		clearTimers();
		releaseRef.current?.();
	};

	const start = () => {
		if (activeRef.current) return;
		activeRef.current = true;
		actionRef.current();
		timeoutRef.current = setTimeout(() => {
			intervalRef.current = setInterval(() => actionRef.current(), interval);
		}, initialDelay);
	};

	// Stop any running timers if the component unmounts mid-hold.
	useEffect(() => clearTimers, []);

	return {
		onPointerDown: () => {
			pointerRef.current = true;
			start();
		},
		onPointerUp: stop,
		onPointerLeave: stop,
		onPointerCancel: stop,
		onClick: () => {
			// Pointer already handled this interaction; only keyboard reaches here.
			if (pointerRef.current) {
				pointerRef.current = false;
				return;
			}
			actionRef.current();
			releaseRef.current?.();
		},
		style: { touchAction: "manipulation" as const, userSelect: "none" as const },
	};
};
