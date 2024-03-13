<script lang="ts">
	import Popup from "../../../components/Popup.svelte"

	export let onclose: oncloseCallback

	import type { oncloseCallback } from "../../../types/miscellaneous"
	import { currentConvStore } from "../../../services/conv/convStore"
	import { currentProfile } from "../../../services/user"

	async function quit() {
		loading = true
		await $currentConvStore.leave()
		onclose(undefined)
	}

	const willDestroyForever = $currentConvStore.members.length === 1

	let loading = false
	let confirm = false
	$: cannotQuit =
		($currentConvStore.owner === $currentProfile.id &&
			!willDestroyForever) ||
		(willDestroyForever && !confirm) ||
		loading
</script>

<Popup {onclose} size="sm" title={$currentConvStore.messages.leave.title}>
	<p class="an-deemphasized-text text-lg">
		{#if willDestroyForever}
			Tu es le dernier membre de ce groupe. Si tu quittes, il se dissoudra
			et sera perdue à jamais.

			<label class="mt-3 flex items-center gap-4">
				<span>J'en suis conscient</span>
				<input
					type="checkbox"
					class="checkbox-primary checkbox"
					bind:checked={confirm} />
			</label>
		{:else if $currentConvStore.owner === $currentProfile.id}
			Tu ne peux pas quitter ce groupe parce que tu en est le
			propriétaire.<br />
			Legue la propriété à quelqu'un d'autre pour pouvoir quitter
		{:else}
			{$currentConvStore.messages.leave.body}
		{/if}
	</p>

	<svelte:fragment slot="footer">
		<button class="btn btn-link text-base-content" on:click={onclose}
			>Annuler</button>
		<button class="btn btn-error" on:click={quit} disabled={cannotQuit}>
			{#if loading}
				<span class="loading loading-spinner"></span>
			{/if}
			Oui
		</button>
	</svelte:fragment>
</Popup>
