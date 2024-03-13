<script lang="ts">
	import Alert from "../../components/Alert.svelte"

	import type { Relation } from "../../types/records"
	import { onMount } from "svelte"
	import { currentConvStore } from "../../services/conv/convStore"
	import { isValidImage, VALID_IMAGES_TYPES } from "../../utils/validation"

	let errorMessage = ""

	let messageContent = ""
	let images: File[] = []

	let isInvalidMessage = false
	$: isInvalidMessage =
		messageContent.match(/\S/g) === null && images.length === 0

	$: linesOfTextarea = messageContent.split("\n").length + 1

	type FormContent = {
		[convId: Relation]: {
			messageContent: string
			errorMessage: string
			images: File[]
		}
	} & Object

	let formContentByConv: FormContent = {}
	let lastConvId: Relation = $currentConvStore.title

	onMount(() => {
		return currentConvStore.subscribe(conv => {
			if (conv.title === lastConvId) return

			formContentByConv[lastConvId] = {
				errorMessage,
				images,
				messageContent,
			}
			lastConvId = conv.title

			const formContent = formContentByConv[conv.title]

			if (formContent) {
				errorMessage = formContent.errorMessage
				images = [...formContent.images]
				messageContent = formContent.messageContent
			}
		})
	})

	async function sendMessage() {
		if (isInvalidMessage) return

		$currentConvStore.sendMessage(messageContent, images)

		messageContent = ""
		errorMessage = ""
		images = []
	}

	async function sendMessageKey(event: KeyboardEvent) {
		if (event.code !== "Enter" || event.shiftKey) return
		await sendMessage()
	}

	function addImages(
		e: Event & { currentTarget: EventTarget & HTMLInputElement },
	) {
		const imagesToAppend = e.currentTarget.files

		if (!imagesToAppend) return

		if (imagesToAppend.length + images.length > 8) {
			errorMessage =
				"Tu ne peux pas envoyer plus de 8 fichiers dans un seul message"
			return
		}

		for (let image of imagesToAppend) {
			if (images.includes(image)) continue

			if (!isValidImage(image)) {
				errorMessage = `Le fichier "${image.name}" n'a pas une extension de fichier valide`
				return
			}

			if (image.size > 1024 * 1024 * 5 /*5 MB*/) {
				errorMessage = `Le fichier "${image.name}" a excédé la taille limite de 5 Megaoctet`
				return
			}

			images.push(image)
		}

		images = images
		errorMessage = ""
	}
</script>

<div class="absolute bottom-0 left-0 h-fit w-full bg-base-100 p-3">
	<form
		class="an-outset-box flex h-fit w-full flex-col gap-4 rounded-xl bg-base-200 px-4 py-2"
		on:submit|preventDefault={sendMessage}>
		<Alert message={errorMessage} />

		{#if images.length > 0}
			<div
				class="flex min-w-full flex-nowrap gap-6 overflow-x-auto overflow-y-hidden py-2">
				{#each images as img}
					<div
						class="relative aspect-[9/10] h-64 rounded bg-base-100/80 p-4">
						<button
							class="btn btn-square tooltip tooltip-left absolute -right-2 -top-2 border-none bg-base-100 p-2"
							data-tip="Enlever le fichier"
							aria-label="Enlever le fichier"
							on:click={() =>
								(images = images.filter(ele => ele != img))}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="16"
								width="14"
								viewBox="0 0 448 512"
								class="an-static-color size-full fill-error"
								><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
									d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
						</button>

						<img
							src={URL.createObjectURL(img)}
							alt=""
							class="aspect-square w-full object-contain" />
						<footer
							class="absolute bottom-2 left-2 w-11/12 overflow-hidden text-ellipsis whitespace-nowrap text-sm">
							{img.name}
						</footer>
					</div>
				{/each}
			</div>
		{/if}

		<div class="flex min-h-16 items-start [--height:2.5em]">
			<div class="flex h-[--height] items-center">
				<div
					class="relative mr-2 size-7 rounded-full bg-base-content/75 p-0.5 hover:bg-base-content/90">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						class="an-static-color h-full w-full fill-base-300"
						><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
							d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
					<input
						multiple
						type="file"
						class="an-file-button-icon"
						accept={VALID_IMAGES_TYPES}
						on:change={addImages} />
				</div>
			</div>

			<textarea
				class="max-h-[10lh] min-h-[1lh] flex-grow bg-transparent p-2 text-lg leading-[--line-height] [--line-height:1.2em] placeholder:text-base-content/20"
				bind:value={messageContent}
				on:keyup={sendMessageKey}
				placeholder="Envoyer un message ..."
				aria-label="Contenu du message à envoyer"
				style="height: calc(var(--line-height) * {linesOfTextarea})" />

			<div class="flex h-[--height]">
				<div class="divider divider-horizontal mx-1"></div>

				<button
					type="submit"
					class="grid aspect-square disabled:cursor-not-allowed"
					disabled={isInvalidMessage}
					aria-label="Envoyer le message">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="an-static-color place-self-center transition-all {isInvalidMessage
							? 'fill-base-300/80'
							: '!fill-primary/90'}">
						<path
							d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
					</svg>
				</button>
			</div>
		</div>
	</form>
</div>
