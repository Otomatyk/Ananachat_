<script lang="ts">
	import type { ComponentType } from "svelte"
	import { friendShips } from "../../features/friends-menu/friendsRequests"
	import { currentProfile } from "../../services/user"

	let showedPopup: ComponentType | null = null

	$: receviedFriendsRequests = $friendShips.filter(
		friendship =>
			friendship.state === 0 && friendship.to === $currentProfile.id,
	)

	const showSettingsPopup = async () =>
		(showedPopup = (await import("../page-settings/SettingsPage.svelte"))
			.default)
	const showCreateGroupPopup = async () =>
		(showedPopup = (
			await import("../../lib/popups/group/CreateGroup.svelte")
		).default)
	const showFriendsMenuPopup = async () =>
		(showedPopup = (await import("../friends-menu/FriendsMenu.svelte"))
			.default)
</script>

<svelte:component this={showedPopup} onclose={() => (showedPopup = null)} />

<ul class="bottom-0 z-10 flex h-16 w-full justify-evenly bg-base-100/10 p-1.5">
	<li>
		<button
			class="btn btn-square btn-ghost"
			on:click={showCreateGroupPopup}
			aria-label="Créer un groupe">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="1em"
				viewBox="0 0 448 512"
				><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
		</button>
	</li>

	<li>
		<button
			class="btn btn-square btn-ghost"
			on:click={showSettingsPopup}
			aria-label="Aller aux paramêtres">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="1em"
				viewBox="0 0 512 512"
				><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
		</button>
	</li>

	<li>
		<div class="indicator">
			{#if receviedFriendsRequests.length !== 0}
				<span class="badge indicator-item badge-accent font-medium">
					<span
						class="absolute left-0 top-0 size-full animate-ping rounded-full bg-accent" />

					<span class="z-10">
						{receviedFriendsRequests.length}
					</span>
				</span>
			{/if}

			<button
				class="btn btn-square btn-ghost"
				aria-label="Demandes d'amis"
				on:click={showFriendsMenuPopup}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="1em"
					viewBox="0 0 640 512"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
						d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" /></svg>
			</button>
		</div>
	</li>
</ul>

<style lang="postcss">
	svg {
		@apply size-4/5;
	}
</style>
