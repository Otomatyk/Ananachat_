<script lang="ts">
	export let onclose: oncloseCallback
	export let kickedMember: UserProfile

	import Popup from "../../components/Popup.svelte"

	import type { oncloseCallback } from "../../types/miscellaneous"
	import type { UserProfile } from "../../types/records"
	import { currentConvStore } from "../../services/conv/convStore"
</script>

<Popup
	{onclose}
	size="sm"
	onsubmit={async () => await $currentConvStore.kickMember(kickedMember.id)}
	title="Expluser {kickedMember.displayname} de {$currentConvStore.title}">
	<p>
		Es-tu sûr de vouloir l'expluser ? <br />
		Tu pourra rajouter plus tard cette personne.
	</p>

	<svelte:fragment slot="footer">
		<button class="an-tertiary-btn btn" on:click={onclose}>Annuler</button>
		<button class="btn btn-error" type="submit">Expluser</button>
	</svelte:fragment>
</Popup>
