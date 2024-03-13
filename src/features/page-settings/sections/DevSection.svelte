<script lang="ts">
	import Popup from "../../../components/Popup.svelte"

	const POPUP_SIZES = ["sm", "md", "lg", "fluid", "full"]
	let showedPopupSize: null | "sm" | "md" | "lg" | "fluid" | "full" = null
</script>

{#if showedPopupSize}
	<Popup
		size={showedPopupSize}
		onclose={() => (showedPopupSize = null)}
		title="Ceci est une popup de taille {showedPopupSize.toUpperCase()}">
		<p class="an-deemphasized-text">
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor
			cumque culpa porro doloribus, voluptatibus facilis. Asperiores ad
			repudiandae tempore est corrupti consequatur porro? Itaque omnis
			earum placeat suscipit est a.
		</p>

		<svelte:fragment slot="footer">
			<button class="btn btn-primary">Bouton 1</button>
			<button class="btn btn-error">Bouton 2</button>
		</svelte:fragment>
	</Popup>
{/if}

<div class="w-full space-y-10">
	<div class="grid w-full grid-cols-4 gap-3 p-2">
		<button class="btn btn-primary">Primary</button>
		<button class="btn btn-error">Error</button>
		<button class="btn btn-warning">Warning</button>
		<button class="btn btn-success">Success</button>
		<button class="btn btn-info">Info</button>
		<button class="btn">Default</button>
		<button class="btn btn-secondary">Secondary</button>
		<button class="btn btn-accent">Accent</button>
	</div>

	<div class="w-full space-y-0">
		{#each ["light", "sakura", "dark", "black"] as theme}
			<div
				class="grid w-full grid-cols-3 text-lg font-medium *:aspect-video *:p-2"
				data-theme={"ananachat-" + theme}>
				<div class="bg-base-100">Base 100</div>
				<div class="bg-base-200">Base 200</div>
				<div class="bg-base-300">Base 300</div>
			</div>
		{/each}
	</div>

	<div>
		<h5 class="text-xl">Faire appraraître une popup de taille</h5>

		<div class="mt-5 grid grid-cols-3 gap-4">
			{#each POPUP_SIZES as size}
				<button
					class="btn btn-neutral btn-lg"
					on:click={() => (showedPopupSize = size)}>
					{size.toUpperCase()}
				</button>
			{/each}
		</div>
	</div>
</div>
