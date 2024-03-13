<script lang="ts">
	import UserProfile from "../../lib/popups/UserProfile.svelte"

	import type { Relation } from "../../types/records"
	import { friendShips } from "./friendsRequests"
	import { userProfileCache } from "../../lib/typescript/caches"
	import { pb } from "../../lib/typescript/pb"
	import { currentProfile } from "../../services/user"

	let showUserProfileId: Relation

	async function acceptInvite(inviteId: Relation) {
		await pb.collection("friends_requests").update(inviteId, { state: 1 })
	}

	async function rejectInvite(inviteId: Relation) {
		await pb.collection("friends_requests").update(inviteId, { state: -1 })
	}
</script>

{#if showUserProfileId}
	<UserProfile
		onclose={() => (showUserProfileId = "")}
		userId={showUserProfileId} />
{/if}

<div class="my-2 flex flex-col gap-3">
	<h2 class="text-lg">Demandes d'amis reçues ou envoyées</h2>

	<ul class="menu gap-4 p-0">
		{#each $friendShips.filter(friendship => friendship.state === 0) as req}
			{#await userProfileCache.getFriend(req) then friendProfile}
				<li class="relative w-full max-w-xl rounded-box">
					<button
						class="an-outset-box flex gap-3 !bg-base-200"
						on:click={() => (showUserProfileId = friendProfile.id)}>
						<div class="avatar p-0.5">
							<img
								alt=""
								src={pb.files.getUrl(
									friendProfile,
									friendProfile.avatar,
								)} />
						</div>

						<h5 class="flex-grow truncate text-lg">
							{friendProfile.displayname}
						</h5>

						{#if req.to === $currentProfile.id}
							<button
								class="btn btn-circle btn-error btn-md pointer-events-auto border-none"
								aria-label="Rejeter la demande d'ami"
								on:click|stopPropagation={() =>
									rejectInvite(req.id)}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 384 512"
									class="h-3/4 w-3/4 fill-error-content"
									><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
										d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
							</button>

							<button
								class="btn btn-circle btn-success btn-md pointer-events-auto border-none"
								aria-label="Accepter la demande d'ami"
								on:click|stopPropagation={() =>
									acceptInvite(req.id)}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 448 512"
									class="h-3/4 w-3/4 fill-success-content"
									><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
										d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>
							</button>
						{:else}
							<p class="text-lg">En attente</p>
						{/if}
					</button>
				</li>
			{/await}
		{/each}
	</ul>

	<small class="an-muted-text"
		>Clique sur un utilisateur pour voir son profil</small>
</div>
