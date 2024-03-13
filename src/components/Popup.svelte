<script lang="ts" context="module">
	import { writable } from "svelte/store"

	let popupStack = writable(0)
</script>

<script lang="ts">
	export let onclose: oncloseCallback
	export let onsubmit: (() => Promise<any>) | false = false
	export let title = ""
	export let shadow = true
	export let size: "sm" | "md" | "lg" | "fluid" | "full" = "sm"

	import type { oncloseCallback } from "../types/miscellaneous"
	import { onDestroy } from "svelte"

	if (title.includes(":"))
		throw new Error(`Invalid title, contains ":" \n "${title}"`)

	if (size === "fluid" || size === "lg") {
		console.trace()

		throw new Error("Invalid Popup.svelte size")
	}

	async function sendForm(ev: Event) {
		if (!onsubmit) return

		await onsubmit()
		;(ev.target as HTMLFormElement).reset()
	}

	let divToAnimate: HTMLElement, shadowBg: HTMLElement
	let closing = false

	let closePopup = onclose

	onclose = function () {
		const animationDuration = 150

		const animationOptions: KeyframeAnimationOptions = {
			duration: animationDuration,
			iterations: 1,
			easing: "ease-in-out",
			fill: "both",
		}

		closing = true

		if (size === "full") {
			divToAnimate.animate(
				[
					{ transform: "translateY(0%)", opacity: 1 },
					{ transform: "translateY(2rem)", opacity: 0 },
				],
				animationOptions,
			)
		} else {
			divToAnimate.animate(
				[
					{ transform: "scale(100%)", opacity: 1 },
					{ transform: "scale(120%)", offset: 0.1 },
					{ transform: "scale(20%)", opacity: 0 },
				],
				animationOptions,
			)

			shadowBg.animate([{ opacity: 1 }, { opacity: 0 }], animationOptions)
		}

		setTimeout(closePopup, animationDuration)
	}

	const THIS_LAYER = $popupStack + 1

	popupStack.update(z => ++z)

	onDestroy(() => {
		popupStack.update(z => --z)
	})
</script>

<div
	class="fixed left-0 top-0 flex size-full items-center justify-center"
	style:z-index={THIS_LAYER * 50 + 1}>
	{#if size != "full"}
		<div
			class="an-animated fixed left-0 top-0 size-full animate-fade {shadow
				? 'bg-[#00000088]'
				: 'bg-[#00000033]'}"
			on:click={onclose}
			bind:this={shadowBg}
			aria-hidden="true" />
	{/if}

	<div
		bind:this={divToAnimate}
		class="an-animated an-outset-box-lg absolute bottom-0
         min-h-48 bg-base-300 text-base-content md:static
        {size === 'full' ? '' : 'rounded-box'}
        {closing
			? ''
			: size === 'full'
				? 'animate-fade-up'
				: 'animate-[custom-fade-up] md:animate-jump-in'}

        {{
			sm: 'h-fit w-full max-w-lg',
			md: 'h-fit w-full max-w-2xl',
			lg: 'h-fit w-full max-w-screen-lg',
			fluid: 'size-fit max-w-[100vw]',
			full: 'size-full',
		}[size]}">
		<svelte:element
			this={onsubmit === false ? "div" : "form"}
			on:submit|preventDefault={onsubmit === false
				? () => null
				: sendForm}
			on:touchmove|stopPropagation
			role="dialog">
			<div class="p-3 pb-9 md:p-5">
				<header
					class="mb-8 flex gap-2 {$$slots.header
						? 'items-baseline'
						: 'items-center'}">
					{#if title}
						<h1 class="flex-grow text-2xl font-medium">{title}</h1>
					{/if}

					{#if $$slots.header}
						<div
							class="flex flex-grow items-center justify-start gap-2">
							<slot name="header" />
						</div>
					{/if}

					<button
						aria-label="Fermer ce dialogue"
						on:click={onclose}
						class="btn btn-square btn-ghost self-center"
						style:z-index={THIS_LAYER * 10}>
						<span class="material-symbols-rounded text-5xl">
							close
						</span>
					</button>
				</header>

				<slot />
			</div>

			{#if $$slots.footer}
				<footer
					class="mt-1 flex flex-row items-center justify-end gap-7 bg-base-200 px-7 py-5 md:rounded-b-btn">
					<slot name="footer" />
				</footer>
			{/if}
		</svelte:element>
	</div>
</div>

<style lang="postcss">
	.an-animated {
		@apply animate-duration-300 animate-once animate-ease-in-out;
	}
</style>
