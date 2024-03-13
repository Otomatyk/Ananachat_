<script lang="ts">
	import Popup from "../../../components/Popup.svelte"

	import { pb } from "../../../lib/typescript/pb"
	import { logOut } from "../../../services/user"

	let showLogoutPopup = false

	async function changeEmail() {
		console.warn(
			await pb
				.collection("users")
				.requestEmailChange("otomatyk@gmail.com"),
		)
	}
</script>

{#if showLogoutPopup}
	<Popup
		size="sm"
		title="Déconnexion"
		onclose={() => (showLogoutPopup = false)}>
		<p class="an-deemphasized-text text-lg">
			Es-tu sûr de vouloir te deconnecter ? <br />
			Tu pourras te reconecter plus tard.
		</p>

		<svelte:fragment slot="footer">
			<button
				class="an-tertiary-btn btn"
				on:click={() => (showLogoutPopup = false)}>Annuler</button>
			<button class="btn btn-error" on:click={logOut}
				>Se deconnecter</button>
		</svelte:fragment>
	</Popup>
{/if}

<div class="my-3 grid w-full grid-cols-2 gap-4">
	<button class="btn btn-neutral" on:click={changeEmail}
		>Changer d'email</button>
	<button class="btn btn-error" on:click={() => (showLogoutPopup = true)}
		>Se déconnecter</button>
	<button class="btn btn-error" on:click={changeEmail}
		>Supprimer le compte</button>
</div>
