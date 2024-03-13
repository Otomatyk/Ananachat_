import { writable } from "svelte/store"
import type { Conversation } from "./convTypes"

function createConvStore() {
	const { set, subscribe, update } = writable<Conversation>()
	let currentConv: Conversation

	subscribe(conv => (currentConv = conv))

	return {
		set: async (conv: Conversation) => {
			if (!conv.ready) return

			if (currentConv) await currentConv.unsubscribe()
			set(conv)
		},

		moveToHome: () => {
			currentConvStore = createConvStore()
			update(conv => conv)
		},

		subscribe,
	}
}
export let currentConvStore = createConvStore()
