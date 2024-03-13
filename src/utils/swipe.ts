import type { Action } from "svelte/action"
import type { Writable } from "svelte/store"

export type Distance = [number, "px" | "%"]
export type SwipeStrategy = "translate" | "position"

export interface SwipeParams {
	swipDirection: "top" | "bottom" | "left" | "right"

	maxDeviation?: Distance
	minDistance?: Distance
	triggerDistance?: Distance
	maxSwipe?: Distance

	finalAction?: () => any

	store: Writable<number>

	strategy: SwipeStrategy
	propagtion?: boolean
}

function distanceToPx(dist: Distance, nodeSize: number): number {
	if (dist[1] === "px") return dist[0]

	return nodeSize * (dist[0] / 100)
}

export const swipe: Action<HTMLElement, SwipeParams> = (node, param) => {
	let mainAxisSize: number, secondaryAxisSize: number

	let swipeStartPos = {
		mainAxis: -1,
		secondaryAxis: -1,
	}

	let translateProperty: "translateX" | "translateY"

	let mainAxisEventProperty: "screenX" | "screenY"
	let secondaryAxisEventProperty: "screenX" | "screenY"

	let chooseValueFn: (a: number, b: number) => number

	// The secondaryAxis is perpendicular to the swipe direction

	if (["top", "bottom"].includes(param.swipDirection)) {
		mainAxisSize = node.clientHeight
		secondaryAxisSize = node.clientWidth

		translateProperty = "translateY"

		mainAxisEventProperty = "screenY"
		secondaryAxisEventProperty = "screenX"
	} else {
		mainAxisSize = node.clientWidth
		secondaryAxisSize = node.clientHeight

		translateProperty = "translateX"

		mainAxisEventProperty = "screenX"
		secondaryAxisEventProperty = "screenY"
	}

	let triggerDistance = distanceToPx(
		param.triggerDistance || [0, "px"],
		mainAxisSize,
	)
	let minDistance = distanceToPx(param.minDistance || [15, "%"], mainAxisSize)
	let maxDeviation = distanceToPx(
		param.maxDeviation || [50, "%"],
		secondaryAxisSize,
	)
	let maxSwipe = distanceToPx(param.maxSwipe || [100, "%"], mainAxisSize)

	let moved: number

	chooseValueFn = ["bottom", "right"].includes(param.swipDirection)
		? Math.max
		: Math.min

	function startSwipping(mainAxis: number, secondaryAxis: number) {
		swipeStartPos = { mainAxis, secondaryAxis }
	}

	function swipping(
		mainAxis: number,
		secondaryAxis: number,
	): true | undefined {
		if (swipeStartPos.mainAxis === -1) return true

		const MAIN_AXIS_DIST = chooseValueFn(
			mainAxis - swipeStartPos.mainAxis,
			0,
		)

		if (Math.abs(MAIN_AXIS_DIST) < minDistance) return

		if (
			Math.abs(secondaryAxis - swipeStartPos.secondaryAxis) > maxDeviation
		) {
			stopSwipping(mainAxis, secondaryAxis)
			return
		}

		if (maxSwipe < Math.abs(MAIN_AXIS_DIST) - minDistance) return

		param.store.set(
			MAIN_AXIS_DIST > 0
				? MAIN_AXIS_DIST - minDistance
				: MAIN_AXIS_DIST + minDistance,
		)
	}

	function stopSwipping(mainAxis: number, secondaryAxis: number) {
		if (
			triggerDistance <= Math.abs(moved) + 5 &&
			Math.abs(secondaryAxis - swipeStartPos.secondaryAxis) <
				maxDeviation &&
			param.finalAction
		) {
			const EXIT = param.finalAction()

			if (EXIT) return
		}

		swipeStartPos = {
			mainAxis: -1,
			secondaryAxis: -1,
		}

		param.store.set(0)
	}

	const UNSUBSCRIBE = param.store.subscribe(move => {
		moved = move

		if (param.strategy === "position")
			node.style[param.swipDirection] = move + "px"
		else node.style.transform = `${translateProperty}(${move}px)`
	})

	node.addEventListener("touchstart", (ev): void => {
		if (!param.propagtion) ev.stopPropagation()

		startSwipping(
			ev.touches[0][mainAxisEventProperty],
			ev.touches[0][secondaryAxisEventProperty],
		)
	})

	node.addEventListener("touchmove", (ev): void => {
		if (!param.propagtion) ev.stopPropagation()

		swipping(
			ev.touches[0][mainAxisEventProperty],
			ev.touches[0][secondaryAxisEventProperty],
		)
	})

	node.addEventListener("touchend", (ev): void => {
		if (!param.propagtion) ev.stopPropagation()

		stopSwipping(
			ev.changedTouches[0][mainAxisEventProperty],
			ev.changedTouches[0][secondaryAxisEventProperty],
		)
	})

	return {
		destroy: () => UNSUBSCRIBE(),
	}
}
