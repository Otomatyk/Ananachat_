<script lang="ts">
	export let undoChanges: Function, changed: boolean
	export let saveChanges: Function = () => null
</script>

{#if changed}
	<div
		class="fixed bottom-1 right-1 z-10 max-w-full animate-fade p-4 animate-duration-200">
		<div
			class="an-outset-box-lg flex flex-wrap items-center justify-evenly gap-2 rounded-box bg-base-200 p-4">
			<p class="text-lg">Il reste des modifications non-enregistrés !</p>

			<button
				class="an-tertiary-btn btn btn-md"
				on:click={() => undoChanges()}>Rénitialiser</button>
			<button
				class="btn btn-primary btn-md"
				on:click={() => saveChanges()}
				type="submit">Enregistrer</button>
		</div>
	</div>
{/if}
