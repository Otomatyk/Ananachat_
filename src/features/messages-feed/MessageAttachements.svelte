<script lang="ts">
	import Popup from "../../components/Popup.svelte"

	import type { MessageWithAuthor } from "../../types/records"
	import { pb } from "../../lib/typescript/pb"

	export let message: MessageWithAuthor

	let showImgUrl: string | null
	let showImgName: string
</script>

{#if showImgUrl}
	<Popup onclose={() => (showImgUrl = null)} size="fluid">
		<div slot="header">
			<!--Used to add space on top, so the close button isn't on top of the image-->
		</div>

		<div class="relative h-[75vmin] w-[75vmin]">
			<img
				src={showImgUrl}
				alt={showImgName}
				class="h-full place-self-center object-contain" />
			<h3
				class="absolute bottom-2 left-2 bg-base-300/10 p-1.5 backdrop-blur-lg"
				style="text-shadow: black 0px 0px 6px;">
				{showImgName}
			</h3>
		</div>
	</Popup>
{/if}

{#if message.images}
	<div class="flex flex-wrap items-end gap-1">
		{#each message.images as fileName}
			{@const imgUrl = pb.files.getUrl(
				{ id: message.id, collectionId: message.collectionId },
				fileName,
			)}

			<button
				on:click={() => {
					showImgUrl = imgUrl
					showImgName = fileName
				}}>
				<img
					class="min-w-[4rem] max-w-[60%] rounded-md"
					src={imgUrl}
					alt="" />
			</button>
		{/each}
	</div>
{/if}
