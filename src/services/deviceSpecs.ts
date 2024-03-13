import { readable } from "svelte/store"

export let isMobile = readable(false, set => {
	const EVENT_HANDLER = () => {
		set(window.innerWidth <= 767 && window.innerHeight <= 950)
	}

	window.addEventListener("resize", EVENT_HANDLER, false)

	EVENT_HANDLER()

	return () => window.removeEventListener("resize", EVENT_HANDLER, false)
})

export const isDev = false
