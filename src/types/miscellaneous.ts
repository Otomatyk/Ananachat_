export type oncloseCallback = (
	event?:
		| MouseEvent
		| (KeyboardEvent & { currentTarget: EventTarget & HTMLButtonElement }),
) => any
