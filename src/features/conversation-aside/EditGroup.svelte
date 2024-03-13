<script lang="ts">
	export let onclose: Function

	import { currentConvStore } from "../../services/conv/convStore"
	import UnsavedChangesConfirm from "../../components/UnsavedChangesConfirm.svelte"

	let newName = $currentConvStore.pureTitle
	let newDescription = $currentConvStore.description

	$: unsavedChanges =
		newName !== $currentConvStore.pureTitle ||
		newDescription !== $currentConvStore.description

	function undoChanges() {
		newName = $currentConvStore.pureTitle
		newDescription = $currentConvStore.description
	}

	async function saveChanges() {
		await $currentConvStore.update(newName, newDescription)
	}
</script>

<form on:submit|preventDefault={saveChanges} class="relative w-full grow pt-3">
	<label class="form-control">
		<span>Nom du groupe</span>
		<input
			type="text"
			class="input"
			bind:value={newName}
			max="30"
			required
			autocomplete="off" />
	</label>

	<label class="form-control">
		<span>Description du groupe</span>
		<input
			type="text"
			class="input"
			bind:value={newDescription}
			max="300"
			autocomplete="off" />
	</label>

	<UnsavedChangesConfirm changed={unsavedChanges} {undoChanges} />
</form>

<div class="absolute bottom-0 left-0 w-full bg-base-100 p-5">
	<button
		class="btn btn-neutral w-full"
		on:click={() => {
			undoChanges()
			onclose()
		}}>Annuler</button>
</div>
