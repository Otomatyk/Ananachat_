<script lang="ts">
	export let message: MessageWithAuthor
	export let onShowUserProfile: (profileId: string) => any

	import MessageAttachements from "./MessageAttachements.svelte"

	import type { MessageWithAuthor } from "../../types/records"
	import { pb } from "../../lib/typescript/pb"
	import { convertPbDatetime } from "../../utils/dates"

	const author = message.authorProfile

	const URL_REGEX =
		/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
	// .slice() removes the endline
	const WORDS = message.content
		.slice(0, message.content.length - 1)
		.split(/\s|\n/gi)
</script>

<button
	on:click={() => onShowUserProfile(author.id)}
	class="flex h-min items-start">
	<img
		class="avatar mr-4 cursor-pointer"
		alt="Photo de profil de {author.displayname}"
		src={pb.files.getUrl(
			{
				id: author.id,
				collectionId:
					pb.collection("users_profiles").collectionIdOrName,
			},
			author.avatar,
			{ thumb: "256x256" },
		)} />
</button>

<div class="w-0 flex-grow">
	<span class="flex h-min w-full items-baseline">
		<span class="font-medium">{author.displayname}</span>

		<time datetime={message.created} class="an-muted-text ml-3 text-xs">
			{convertPbDatetime(message.created)}
		</time>
	</span>

	<div class="flex items-baseline">
		<p
			class="w-full max-w-prose whitespace-break-spaces break-words text-base-content">
			{#each WORDS as w}
				{@const WORD = w + " "}

				{#if WORD.match(URL_REGEX)}
					<a href={w} class="link link-info" target="_blank"
						>{WORD}</a>
				{:else}
					{WORD}
				{/if}
			{/each}
		</p>

		{#if message.updated !== message.created}
			<p class="an-muted-text ml-5 text-sm">(modifié)</p>
		{/if}
	</div>

	<MessageAttachements {message} />
</div>
