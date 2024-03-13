<script lang="ts">
	import type { ComponentType } from "svelte"
	import { currentConvStore } from "../../services/conv/convStore"

	let groupActionsEle: ComponentType
</script>

<div class="relative left-0 top-0 h-16 min-h-16 w-full bg-base-200 p-1.5">
	<div class="drawer drawer-end">
		<input
			id="actions-drawer"
			type="checkbox"
			class="drawer-toggle"
			on:change={async () =>
				(groupActionsEle = (
					await import(
						"../conversation-aside/ConversationAside.svelte"
					)
				).default)} />

		<header class="drawer-content flex items-center justify-between pr-2">
			<h1 class="ml-3 max-w-64 truncate text-lg underline">
				{$currentConvStore.title}
			</h1>

			<div class="grow"><!--For spacing--></div>

			<label
				class="btn btn-square btn-ghost drawer-button"
				for="actions-drawer">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="16"
					width="14"
					viewBox="0 0 448 512"
					class="h-3/4 w-3/4"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
						d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" /></svg>
			</label>
		</header>

		<div class="drawer-side z-20">
			<label
				for="actions-drawer"
				aria-label="close sidebar"
				class="drawer-overlay" />

			<svelte:component this={groupActionsEle} />
		</div>
	</div>
</div>
