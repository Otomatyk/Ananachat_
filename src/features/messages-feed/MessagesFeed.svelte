<script lang="ts">
	import Message from "./Message.svelte"
	import UserProfile from "../../lib/popups/UserProfile.svelte"

	import type { RecordSubscription } from "pocketbase"
	import type { MessageWithAuthor, Relation } from "../../types/records"

	import { currentConvStore } from "../../services/conv/convStore"
	import { askNotificationPermission } from "../../utils/validation"

	import { afterUpdate, onMount } from "svelte"
	import { currentProfile } from "../../services/user"

	async function onNewMessage(event: RecordSubscription<MessageWithAuthor>) {
		console.debug("    New message ! ")

		const AUHTOR = event.record.authorProfile
		const MSG_INDEX = messages.map(msg => msg.id).indexOf(event.record.id)

		switch (event.action) {
			case "create":
				if (
					Notification.permission === "granted" &&
					AUHTOR.id !== $currentProfile.id
				) {
					new Notification(
						`${AUHTOR.displayname} dans "${$currentConvStore.title}`,
						{
							body: event.record.content,
							silent: true,
						},
					)
				}

				messages.unshift(event.record)
				break

			case "delete":
				messages.splice(MSG_INDEX, 1)
				break

			case "update":
				messages[MSG_INDEX].content = event.record.content
				messages[MSG_INDEX].updated = event.record.updated
				break
		}

		messages = [...messages]
	}

	let showUserProfileId: Relation

	let messages: MessageWithAuthor[]
	let messagesEle: HTMLElement

	let lastConvId = ""

	afterUpdate(async () => {
		const maxScroll = messagesEle.scrollHeight

		if (messagesEle.scrollTop - maxScroll < 20)
			messagesEle.scrollTop = maxScroll
	})

	onMount(() => {
		askNotificationPermission()

		return currentConvStore.subscribe(async conv => {
			// In the case only conv's metadatas (Ttile, description ...ect) has changed
			if (!conv.ready || lastConvId === conv.recordId) return

			lastConvId = conv.recordId

			console.debug("Fetched messages")

			messages = await conv.fetchRecentMessages()

			await conv.subscribe(onNewMessage)
		})
	})
</script>

{#if showUserProfileId}
	<UserProfile
		onclose={() => (showUserProfileId = "")}
		userId={showUserProfileId} />
{/if}

<ol
	class="h-[80%] overflow-y-auto overflow-x-hidden py-5"
	bind:this={messagesEle}>
	{#if !messages}
		<p class="sr-only">En chargement</p>

		{#each [1, 2, 3, 4] as i}
			<li class="my-5 flex w-full px-5 py-2" aria-hidden="true">
				<div
					class="skeleton mr-8 h-16 w-16 shrink-0 rounded-full bg-base-200">
				</div>

				<div class="flex w-3/4 flex-col gap-4 md:w-1/2">
					<div class="skeleton h-4 w-3/4 bg-base-200"></div>
					<div class="skeleton h-4 w-full bg-base-200"></div>
				</div>
			</li>
		{/each}
	{:else}
		{#each messages.toReversed() as message (message.id)}
			<Message
				{message}
				onShowUserProfile={profileId =>
					(showUserProfileId = profileId)} />
		{:else}
			<li class="h-full w-full p-3 grid">
				<p class="text-2xl place-self-center">
					Aucun message n'as était encore envoyé ici.<br />
					Soit le/la prémier(e) !
				</p>
			</li>
		{/each}
	{/if}
</ol>
