<script lang="ts">
	export let message: MessageWithAuthor
	export let action: Writable<"delete" | "edit" | "choose" | "">

	import Popup from "../../components/Popup.svelte"

	import type { MessageWithAuthor } from "../../types/records"
	import type { Writable } from "svelte/store"
	import { pb } from "../../lib/typescript/pb"
	import { currentConvStore } from "../../services/conv/convStore"
	import { convertRelativePbDatetime } from "../../utils/dates"

	async function deleteMessage() {
		await $currentConvStore.deleteMessage(message.id)
		$action = ""
	}
</script>

{#if $action === "choose"}
	<Popup onclose={() => ($action = "")} title="Actionner un message">
		<ul class="grid w-full grid-cols-2 gap-8">
			<li>
				<button
					class="btn btn-neutral btn-lg w-full"
					on:click={() => ($action = "edit")}>
					Editer
				</button>
			</li>

			<li>
				<button
					class="btn btn-error btn-lg w-full"
					on:click={() => ($action = "delete")}>
					Supprimer
				</button>
			</li>
		</ul>
	</Popup>
{/if}

{#if $action === "delete"}
	{@const author = message.authorProfile}

	<Popup
		onclose={() => ($action = "")}
		title="Es-tu sûr de vouloir supprimer ce message ?">
		<div
			class="relative my-5 flex max-h-64 w-full overflow-y-auto px-5 py-2">
			<img
				class="avatar mr-4 h-min"
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

			<div class="w-full">
				<span class="flex h-min w-full items-baseline font-semibold">
					{author.displayname}

					<small class="ml-3 text-xs">
						<time datetime={message.created}>
							{convertRelativePbDatetime(message.created)}
						</time>
					</small>
				</span>

				<p class="w-full break-words text-base-content"></p>
				<pre class="font-sans">{message.content}</pre>
			</div>
		</div>

		<div slot="footer">
			<button
				class="btn btn-link text-base-content"
				on:click={() => ($action = "")}>Annuler</button>
			<button class="btn btn-error" on:click={deleteMessage}
				>Supprimer</button>
		</div>
	</Popup>
{:else if $action === "edit"}
	<div></div>
{/if}

<div
	class="absolute -top-3 right-2 hidden gap-2 hover:shadow-md lg:group-hover:flex">
	<div class="actions join" id="actions">
		<button
			data-tip="Supprimer"
			aria-label="Supprimer le message"
			on:click={() => ($action = "delete")}
			class="action-button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="16"
				width="14"
				viewBox="0 0 448 512"
				><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
					d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
		</button>

		<button
			data-tip="Editer"
			aria-label="Editer le message"
			class="action-button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="16"
				width="16"
				viewBox="0 0 512 512"
				><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
					d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" /></svg>
		</button>
	</div>
</div>

<style lang="postcss">
	svg {
		@apply aspect-square h-1/2 place-self-center;
	}

	.action-button {
		@apply btn btn-square !join-item btn-sm tooltip grid;
	}
</style>
