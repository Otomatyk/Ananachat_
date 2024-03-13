<script lang="ts">
	import MessagesFeed from "./messages-feed/MessagesFeed.svelte"
	import ConversationsNav from "./main-nav/ConversationsNav.svelte"
	import MenuNav from "./main-nav/MenuNav.svelte"
	import SendMessageForm from "./send-message/SendMessageForm.svelte"
	import ConvHeader from "./main-nav/ConvHeader.svelte"

	import type { ComponentType } from "svelte"
	import { spring } from "svelte/motion"
	import { isMobile } from "../services/deviceSpecs"
	import { currentConvStore } from "../services/conv/convStore"
	import { conversations } from "./main-nav/ConversationsNav.svelte"

	const showFriendsMenuPopup = async () =>
		(showPopup = (await import("./friends-menu/FriendsMenu.svelte"))
			.default)

	let showPopup: ComponentType | null = null

	const ASIDE_WIDTH_VW = 82
	const MIN_PX_BEFORE_SWAP = 100
	const MAX_Y_DIST_SWAP = 50

	let startingPositionSwipe = [0, 0]
	let moveAside = spring($isMobile ? 0 : ASIDE_WIDTH_VW, {
		stiffness: 0.3,
		damping: 1,
	})

	function startSwipping(ev: TouchEvent) {
		startingPositionSwipe = [ev.touches[0].screenX, ev.touches[0].screenY]
	}

	function swipe(ev: TouchEvent) {
		const Y_DIST = Math.abs(
			startingPositionSwipe[1] - ev.touches[0].screenY,
		)

		if (Y_DIST > MAX_Y_DIST_SWAP) return

		const X_DIST = ev.touches[0].screenX - startingPositionSwipe[0]
		$moveAside = Math.max(
			Math.min(X_DIST - MIN_PX_BEFORE_SWAP, ASIDE_WIDTH_VW),
			0,
		)
	}

	function stopSwiping() {
		$moveAside =
			Math.abs($moveAside) > ASIDE_WIDTH_VW / 2 ? ASIDE_WIDTH_VW : 0
	}
</script>

<svelte:component this={showPopup} onclose={() => (showPopup = null)} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<span class="relative flex size-full flex-nowrap">
	<aside
		class="w-80 bg-base-200"
		style={$isMobile
			? `left: ${-ASIDE_WIDTH_VW + $moveAside}vw; width: ${ASIDE_WIDTH_VW}vw`
			: ""}>
		<nav class="relative flex h-screen flex-col">
			<ConversationsNav />
			<MenuNav />
		</nav>
	</aside>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<main
		class="flex-grow"
		style={$isMobile ? `left: ${$moveAside}vw; width: 100vw` : ""}
		on:touchstart|passive={startSwipping}
		on:touchmove|passive={swipe}
		on:touchend={stopSwiping}>
		{#if !$currentConvStore && $conversations.length > 0}
			<p>Aceuille</p>
		{:else if $currentConvStore}
			<div class="flex h-full w-full flex-col">
				<ConvHeader />
				<MessagesFeed />
				<SendMessageForm />

				<div
					class="absolute left-0 top-0 z-10 size-full bg-black"
					aria-hidden="true"
					hidden={$moveAside === 0 || !$isMobile}
					on:click|stopPropagation={() => ($moveAside = 0)}
					style:opacity={Math.min(
						$moveAside / ASIDE_WIDTH_VW,
						0.5,
					)} />
			</div>
		{:else}
			<div
				class="flex h-full w-full flex-col items-center justify-center gap-10 p-10">
				<img
					src="src\assets\discussion.png"
					alt="Deux bulles de discussions colorés"
					class="max-w-xs object-contain" />

				<p class="text-center text-xl">
					Tu n'as pas encore ajouté d'amis pour commencer à discuter
				</p>
				<button
					class="btn btn-primary btn-lg"
					on:click={showFriendsMenuPopup}>Ajoutes-en un !</button>
			</div>
		{/if}
	</main>
</span>

<style lang="postcss">
	aside,
	main {
		@apply absolute top-0 h-full md:relative;
	}

	aside {
		scrollbar-width: none;
	}
	aside::-webkit-scrollbar {
		display: none;
	}
</style>
