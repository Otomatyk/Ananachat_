<script lang="ts" context="module">
	export let conversations = writable<ConversationSpecs[]>([])
</script>

<script lang="ts">
	import InlineConversationResume from "../../components/InlineConversationResume.svelte"

	import type { Relation } from "../../types/records"
	import type { ConversationSpecs } from "../../services/conv/convTypes"
	import { writable } from "svelte/store"
	import { onMount } from "svelte"
	import { friendShips } from "../../features/friends-menu/friendsRequests"

	import { userProfileCache, groupCache } from "../../lib/typescript/caches"
	import { pb, toUnsuscribe } from "../../lib/typescript/pb"
	import { currentProfile } from "../../services/user"

	import { DMConversation } from "../../services/conv/dmConversation"
	import { GroupConversation } from "../../services/conv/groupConversation"
	import { currentConvStore } from "../../services/conv/convStore"
	import { convertToConversationSpecs as convertToConvSpecs } from "../../services/conv/convUtils"

	async function changeConv(convId: Relation, type: "channel" | "dm") {
		if (convId === $currentConvStore?.recordId) return

		const newConvClass =
			type === "channel" ? GroupConversation : DMConversation

		await currentConvStore.set(new newConvClass(convId))
	}

	let groupsIn: ConversationSpecs[] = []
	let friendsWith: ConversationSpecs[] = []

	$: conversations.set([...groupsIn, ...friendsWith])

	onMount(async () => {
		const groupsMember = await pb
			.collection("channels_members")
			.getFullList({
				filter: `to = "${$currentProfile.id}"`,
				fields: "channel",
				requestKey: "memberIn",
			})

		groupsIn = await Promise.all(
			groupsMember.map(async group =>
				convertToConvSpecs(await groupCache.get(group.channel)),
			),
		)

		toUnsuscribe.add(
			"Friendships realtime",

			friendShips.subscribe(async friendships => {
				friendsWith = await Promise.all(
					friendships
						.filter(friendship => friendship.state === 1)
						.map(async friendship =>
							convertToConvSpecs(
								await userProfileCache.getFriend(friendship),
							),
						),
				)
			}),
		)

		toUnsuscribe.add(
			"Groups nav realtime",

			await pb.collection("channels_members").subscribe("*", async ev => {
				if (ev.action === "delete") {
					const INDEX = groupsIn.findIndex(
						group => group.recordId === ev.record.channel,
					)
					console.warn(INDEX)
					if (!INDEX) return

					groupsIn.splice(INDEX, 1)
					groupsIn = [...groupsIn]

					if ($currentConvStore?.recordId !== ev.record.channel)
						return

					if ($conversations.length > 0) {
						changeConv(
							$conversations[0].recordId,
							$conversations[0].type,
						)
					} else {
						currentConvStore.moveToHome()
					}
				} else if (ev.action === "create") {
					console.warn("klsqjfd")

					groupsIn = [
						...groupsIn,
						convertToConvSpecs(
							await groupCache.get(ev.record.channel),
						),
					]
				}
			}),
		)

		if ($currentConvStore) return

		changeConv($conversations[0].recordId, $conversations[0].type)
	})
</script>

{#if $conversations?.length !== undefined}
	<ul class="menu w-full flex-grow flex-nowrap gap-0.5 overflow-y-auto">
		{#each $conversations as conv (conv.recordId)}
			<li>
				<button
					on:click={() => changeConv(conv.recordId, conv.type)}
					class="z-10 block"
					aria-current={conv.recordId === $currentConvStore?.recordId
						? "location"
						: false}>
					<InlineConversationResume {conv} />
				</button>
			</li>
		{/each}
	</ul>
{:else}
	<span class="loading loading-spinner size-full"></span>
{/if}

<style lang="postcss">
	button[aria-current="location"]::before {
		@apply size-2 bg-primary;
	}
</style>
