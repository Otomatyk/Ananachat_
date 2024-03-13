<script lang="ts">
	import ProfileSection from "./ProfileSection.svelte"
	import AccountSection from "./sections/AccountSection.svelte"
	import ApparenceSection from "./sections/ApparenceSection.svelte"
	import DevSection from "./sections/DevSection.svelte"

	import Popup from "../../components/Popup.svelte"
	import Alert from "../../components/Alert.svelte"
	import UnsavedChangesConfirm from "../../components/UnsavedChangesConfirm.svelte"

	import type { oncloseCallback } from "../../types/miscellaneous"

	import { writable } from "svelte/store"

	export let onclose: oncloseCallback

	let errorMessage = ""
	let hasUnsavedChanges = writable(false)

	let popupConfim: {
		message: string
		confirmMessage: string
		action: Function
	} = {
		message: "",
		confirmMessage: "",
		action: () => null,
	}
</script>

{#if popupConfim.message != ""}
	<Popup
		size="sm"
		onclose={() => (popupConfim.message = "")}
		title="Deconnexion">
		<strong class="text-lg font-normal">{popupConfim.message}</strong>

		<svelte:fragment slot="footer">
			<button
				class="an-tertiary-btn"
				on:click={() => (popupConfim.message = "")}>Annuler</button>
			<button class="btn btn-error" on:click={() => popupConfim.action()}
				>{popupConfim.confirmMessage}</button>
		</svelte:fragment>
	</Popup>
{/if}

<Popup size="full" {onclose} title="Paramêtres">
	<div class="drawer w-full lg:drawer-open">
		<input id="drawer-open" type="checkbox" class="drawer-toggle" />

		<div
			class="drawer-content h-screen w-full overflow-y-auto pb-16 md:flex md:items-start md:justify-center lg:ml-4">
			<div class="w-full max-w-5xl pr-8">
				<Alert message={errorMessage} />

				<section>
					<div>
						<h1 id="profil-section">Profile publique</h1>

						<p class="an-muted-text">
							Ces informations seront visible par tout le monde,
							fait attention à ne pas mettre de donnés
							personelles.
						</p>
					</div>

					<div class="mb-1 flex flex-wrap items-center gap-4">
						<ProfileSection />
					</div>
				</section>

				<section>
					<div>
						<h1 id="skin-section">Apparence</h1>

						<p class="an-muted-text">
							L'application n'est pas à ton goût ? <br />
							Change le thème et customise ton expérience !
						</p>
					</div>

					<div>
						<ApparenceSection />
					</div>
				</section>

				<section>
					<div>
						<h1 id="compte-section">Compte</h1>
					</div>

					<div>
						<AccountSection />
					</div>
				</section>

				<section>
					<div>
						<h1 id="credits-section">Crédits</h1>
					</div>

					<div>
						<p class="mb-5 text-xl">
							Merci à Flaticon pour ces stickers
						</p>

						<div
							class="an-muted-text flex flex-col gap-3 underline">
							<a
								href="https://www.flaticon.com/free-icons/light"
								title="light icons"
								>Light icons created by Freepik</a>
							<a
								href="https://www.flaticon.com/free-icons/dark"
								title="dark icons"
								>Dark icons created by Freepik</a>
							<a
								href="https://www.flaticon.com/free-stickers/message"
								title="message stickers"
								>Message stickers created by Ghozi Muhtarom</a>
							<a
								href="https://www.flaticon.com/free-stickers/timer"
								title="timer stickers"
								>Timer stickers created by Gohsantosadrive -
								Flaticon</a>
							<a
								href="https://www.flaticon.com/free-icons/black-hole"
								title="black hole icons"
								>Black hole icons created by Freepik - Flaticon</a>
							<a
								href="https://www.flaticon.com/free-icons/sakura"
								title="sakura icons"
								>Sakura icons created by Freepik - Flaticon</a>
						</div>
					</div>
				</section>

				<section>
					<div>
						<h1 id="contact">Contacte</h1>

						<p class="an-muted-text">
							Une question ? Une suggestion ? Ou même un
							signalement de bug ? <br />
							N'hésite pas à nous contacter.
						</p>
					</div>

					<div class="flex flex-col items-center">
						<a href="mailto:otomatyk@gmail.com" class="link text-xl"
							>otomatyk@gmail.com</a>

						<p class="divider">OU</p>

						<button class="btn btn-primary btn-sm">
							Rejoindre le groupe de discussion Ananachat
						</button>
					</div>
				</section>

				<section>
					<div>
						<h1>Zone développeur</h1>

						<p class="an-muted-text">
							Bien que accéssible à tout le monde, vous ne verez
							peu d'intérêt à cette zone ; Pour cause, elle permet
							de vérifier les couleurs et les popups.
						</p>
					</div>

					<div>
						<DevSection />
					</div>
				</section>
			</div>
		</div>

		<div class="drawer-side z-20 overflow-x-hidden overflow-y-hidden">
			<label
				for="drawer-open"
				aria-label="close sidebar"
				class="drawer-overlay"></label>

			<nav class="h-full">
				<ul
					class="menu min-h-full w-52 gap-1 rounded-box bg-base-200 p-4 text-lg text-base-content">
					<li><a href="#profil-section">Profile publique</a></li>
					<li><a href="#skin-section">Apparence</a></li>
					<li><a href="#compte-section">Compte</a></li>
					<li><a href="#credits-section">Crédits </a></li>
					<li><a href="#contact">Contacte</a></li>
				</ul>
			</nav>
		</div>
	</div>
</Popup>

<style lang="postcss">
	section {
		@apply mb-24 flex flex-col gap-10 border-t-2 border-solid border-base-100 pt-5 sm:flex-row sm:justify-between sm:gap-16;

		& > :first-child {
			@apply max-w-prose sm:w-80;
		}
	}

	h1 {
		@apply mb-5 text-2xl tracking-tight;

		& + p {
			@apply text-base;
		}
	}
</style>
