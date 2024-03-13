<script lang="ts">
	export let onclose: oncloseCallback

	import Popup from "../../../components/Popup.svelte"
	import Alert from "../../../components/Alert.svelte"

	import type { oncloseCallback } from "../../../types/miscellaneous"
	import { GroupConversation } from "../../../services/conv/groupConversation"
	import { currentConvStore } from "../../../services/conv/convStore"
	import { isValidImage, VALID_IMAGES_TYPES } from "../../../utils/validation"
	import { pb } from "../../typescript/pb"
	import { currentProfile } from "../../../services/user"

	import { shapes } from "@dicebear/collection"
	import { createAvatar } from "@dicebear/core"

	let groupName = ""
	let groupDescription = ""

	let errorMessage = ""

	let selectedIconFile: File
	let selectedIconUrl = createAvatar(shapes, {
		size: 256,
		seed: Math.floor(Math.random() * 1000).toString(),
	}).toDataUriSync()

	async function uploadIcon(
		ev: Event & { currentTarget: EventTarget & HTMLInputElement },
	) {
		if (!ev.currentTarget?.files) return

		const ICON = ev.currentTarget.files[0]

		if (!isValidImage(ICON)) return

		selectedIconUrl = URL.createObjectURL(ICON)
		selectedIconFile = ICON
	}

	async function sendForm() {
		if (!channelIcon) {
			const avatar = await createAvatar(shapesCollection, {
				size: 256,
				seed: groupName + groupDescription,
			})
				.png()
				.toArrayBuffer()

			const fileAvatar = new Blob([avatar])

			channelIcon = new File([fileAvatar], `icon_channel_${groupName}`)
		}

		try {
			const { id } = await pb.collection("channels").create({
				name: groupName,
				description: groupDescription,
				admin: $currentProfile.id,
				icon: channelIcon,
				members: [$currentProfile.id],
			})

			await pb.collection("channels_members").create({
				to: $currentProfile.id,
				channel: id,
			})

			resetFileInput()

			currentConvStore.set(new GroupConversation(id))
		} catch (err) {
			errorMessage = err as string
		}
	}
</script>

<Popup {onclose} onsubmit={sendForm} title="Créer un groupe">
	<div class="mb-5 flex w-full items-center gap-8">
		<div class="aspect-square">
			<div class="an-file-input-image">
				<span class="sr-only">Changer son avatar</span>

				<img
					class="aspect-square h-full"
					src={selectedIconUrl}
					alt="Ton avatar" />

				<input
					type="file"
					accept={VALID_IMAGES_TYPES}
					on:change={uploadIcon} />

				<div class="indicator-item">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16"
						width="16"
						viewBox="0 0 512 512"
						><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
							d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" /></svg>
				</div>
			</div>
		</div>

		<label class="form-control mb-4 flex-grow">
			<span>Nom du groupe</span>

			<input
				type="text"
				class="input w-full"
				bind:value={groupName}
				placeholder="Ex : Général, Média ... ect"
				autocomplete="off"
				maxlength="30"
				required />
		</label>
	</div>

	<label class="form-control w-full">
		<span>Description du groupe</span>

		<textarea
			class="textarea w-full resize-none"
			placeholder="Ex : Ce groupe est fait pour ..."
			autocomplete="off"
			maxlength="300"
			bind:value={groupDescription} />
	</label>

	<Alert message={errorMessage} />

	<svelte:fragment slot="footer">
		<button class="btn btn-primary" type="submit" disabled={!groupName}
			>Créer le groupe</button>
	</svelte:fragment>
</Popup>
