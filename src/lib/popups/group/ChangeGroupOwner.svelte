<script lang="ts">
	export let onclose: oncloseCallback
	export let newOwner: UserProfile

	import { type oncloseCallback } from "../../../types/miscellaneous"
	import type { UserProfile } from "../../../types/records"
	import { currentConvStore } from "../../../services/conv/convStore"

	import Popup from "../../../components/Popup.svelte"

	async function changeOwner() {
		if (selectedHeir == undefined) return

		await $currentConvStore.changeOwner(selectedHeir.id)

		changed = true
	}

	let confirm = false
	let changed = false
	let selectedHeir: UserProfile
	const convTitle = $currentConvStore.title.slice(2)
</script>

<Popup
	{onclose}
	onsubmit={async () => null}
	title="Leguer la propriété de {$currentConvStore.title}">
	<div class="divider"></div>

	{#if changed}
		<strong class="alert alert-success mb-0">Propriété transmise !</strong>
	{:else}
		<strong class="alert alert-error mb-3"
			>Si tu changes le propriétaire du groupe, tu retournera au grade de
			membre !</strong>
	{/if}

	<div class="form-control">
		<label class="label px-5">
			<span class="label-text"
				>Je donne la propriété du groupe "{convTitle}" à "{selectedHeir?.displayname}"</span>
			<input type="checkbox" class="checkbox" bind:checked={confirm} />
		</label>
	</div>

	<svelte:fragment slot="footer">
		<button
			class="btn btn-error"
			type="submit"
			disabled={!confirm}
			on:click={() => changeOwner()}>
			Leguer
		</button>
	</svelte:fragment>
</Popup>
