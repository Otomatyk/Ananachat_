<script lang="ts">
	export let message: MessageWithAuthor
	export let onShowUserProfile: (profileId: string) => any

	import MessageActions from "./MessageActions.svelte"
	import MessageCore from "./MessageCore.svelte"

	import type { MessageWithAuthor } from "../../types/records"
	import {
		swipe,
		type Distance,
		type SwipeParams,
		type SwipeStrategy,
	} from "../../utils/swipe"

	import { tweened } from "svelte/motion"
	import { linear } from "svelte/easing"
	import { writable } from "svelte/store"

	let messageAction = writable<"" | "delete" | "edit" | "choose">("")

	let move = tweened(0, {
		easing: linear,
		duration: 120,
	})

	const SWIPE_PARAMS: SwipeParams = {
		strategy: "position" as SwipeStrategy,
		store: move,

		propagtion: false,

		maxSwipe: [100, "px"] as Distance,
		triggerDistance: [85, "px"] as Distance,

		swipDirection: "left",
		finalAction: () => {
			messageAction.set("choose")
		},
	}
</script>

<li class="group relative my-5 w-full text-lg">
	<div class="derriere-message right-0 justify-end bg-indigo-400">
		<span
			class="material-symbols-rounded an-static-color text-6xl text-indigo-800">
			expand_more
		</span>
	</div>

	<div
		class="relative flex bg-base-100 px-5 py-2 hover:bg-base-200"
		use:swipe={SWIPE_PARAMS}>
		<MessageCore {message} {onShowUserProfile} />
		<MessageActions {message} action={messageAction} />

		<div
			class="absolute left-0 top-0 size-full bg-slate-950"
			style:opacity={Math.min(
				Math.abs($move) / SWIPE_PARAMS.maxSwipe[0],
				0.75,
			)} />
	</div>
</li>

<style lang="postcss">
	.derriere-message {
		@apply absolute bottom-[1px] flex h-[calc(100%-2px)] w-1/2 p-5;
	}

	.derriere-message > svg {
		@apply aspect-square h-full;
	}
</style>
