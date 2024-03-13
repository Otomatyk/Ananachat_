<script lang="ts">
	export let onclose: oncloseCallback

	import Popup from "../../components/Popup.svelte"

	import type { Relation, UserProfile } from "../../types/records"
	import { pb } from "../../lib/typescript/pb"
	import { currentConvStore } from "../../services/conv/convStore"
	import { userProfileCache } from "../../lib/typescript/caches"
	import { type oncloseCallback } from "../../types/miscellaneous"

	let selectedFriendsIds: Relation[] = []

	let friendsProfiles: UserProfile[] = []
	let searchName = ""

	$: filteredFriends =
		searchName === ""
			? friendsProfiles
			: friendsProfiles.filter(
					friend =>
						friend.displayname
							.toLowerCase()
							.search(searchName.toLowerCase()) !== -1,
				)

	pb.collection("friends_requests")
		.getFullList({ filter: `state = "1"`, fields: "from,to" })
		.then(async friendsShips => {
			friendsProfiles = await Promise.all(
				friendsShips
					.filter(
						friendShip =>
							!$currentConvStore.membersIds.includes(
								friendShip.id,
							),
					)
					.map(friendShip => userProfileCache.getFriend(friendShip)),
			)
		})

	function addToSelected(
		friendId: Relation,
		ev: Event & { currentTarget: EventTarget & HTMLInputElement },
	): void {
		if ((ev.target as HTMLInputElement).checked)
			selectedFriendsIds = [...selectedFriendsIds, friendId]
		else
			selectedFriendsIds = selectedFriendsIds.filter(
				ele => friendId != ele,
			)
	}

	async function addMembers() {
		for await (let friendId of selectedFriendsIds) {
			await pb.collection("channels_members").create({
				channel: $currentConvStore.recordId,
				to: friendId,
			})
		}

		friendsProfiles = friendsProfiles.filter(
			friend => !selectedFriendsIds.includes(friend.id),
		)
		selectedFriendsIds = []

		await $currentConvStore.refresh()
	}
</script>

<Popup
	{onclose}
	onsubmit={addMembers}
	title="Ajouter des membres au groupe {$currentConvStore.title}">
	<section class="my-2 w-full">
		{#if friendsProfiles.length > 0}
			<h2 class="an-deemphasized-text mb-1 text-lg">
				Choisis des amis à rajouter dans ce groupe
			</h2>
			<input
				type="search"
				class="input mb-6 w-full"
				placeholder="Cherche un nom ..."
				bind:value={searchName} />
		{/if}

		{#if filteredFriends.length > 0}
			<ul
				class="menu h-fit max-h-64 w-full flex-nowrap gap-3 overflow-y-auto p-0">
				{#each filteredFriends as friend}
					<li class="form-control m-0">
						<label
							class="label !w-full cursor-pointer rounded-box bg-base-200/85">
							<span class="flex flex-grow items-center gap-4">
								<img
									alt="Photo de profile de {friend.displayname}"
									src={pb.files.getUrl(friend, friend.avatar)}
									class="avatar" />

								<span
									class="label-text w-[14ch] overflow-hidden overflow-ellipsis text-lg md:w-[20ch]"
									>{friend.displayname}</span>
							</span>

							<input
								type="checkbox"
								name="friend-to-invite"
								class="checkbox-primary checkbox checkbox-lg"
								on:change={ev =>
									addToSelected(friend.id, ev)} />
						</label>
					</li>
				{/each}
			</ul>
		{:else if friendsProfiles.length === 0}
			<p class="text-lg">
				Nous n'avons pas trouvé d'amis n'étant pas dans ce groupe<br />
			</p>
		{:else}
			<p class="w-full text-center text-lg">
				Nous n'avons pas trouvé d'amis correspondant à ce nom. <br />
				Essaye quelque chose d'autre
			</p>
		{/if}
	</section>

	<svelte:fragment slot="footer">
		<button
			type="submit"
			class="btn btn-primary"
			disabled={selectedFriendsIds.length === 0}>
			Ajouter {selectedFriendsIds.length} membres au groupe
		</button>
	</svelte:fragment>
</Popup>
