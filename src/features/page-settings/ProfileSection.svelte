<script lang="ts">
	import { writable } from "svelte/store"
	import UnsavedChangesConfirm from "../../components/UnsavedChangesConfirm.svelte"
	import AvatarInput from "../../components/inputs/AvatarInput.svelte"

	import { pb } from "../../lib/typescript/pb"
	import { reloadUser, currentProfile } from "../../services/user"

	let errorMessage = ""
	let hasUnsavedChanges = false

	$: hasUnsavedChanges =
		newName !== $currentProfile.displayname ||
		newDescription !== $currentProfile.description ||
		oldAvatar !== $avatar

	async function initNewProfile() {
		hasUnsavedChanges = false

		newName = $currentProfile.displayname
		newDescription = $currentProfile.description

		const AVATAR_BLOB = await (
			await fetch(
				pb.files.getUrl($currentProfile, $currentProfile.avatar),
			)
		).blob()

		oldAvatar = $avatar = new File([AVATAR_BLOB], $currentProfile.avatar, {
			type: AVATAR_BLOB.type,
		})
	}

	async function saveNewProfile() {
		let payload: any = {
			displayname: newName,
			description: newDescription,
		}

		if ($avatar !== oldAvatar) {
			console.warn(new File([$avatar], "avatar"))

			payload.avatar = $avatar
			oldAvatar = $avatar
		}

		await pb
			.collection("users_profiles")
			.update($currentProfile.id, payload)
		await reloadUser()

		await initNewProfile()
	}

	function undoProfileChanges() {
		newName = $currentProfile.displayname
		newDescription = $currentProfile.description

		$avatar = oldAvatar
	}

	let newName = "",
		newDescription = ""

	let oldAvatar: File
	let avatar = writable(new File([], ""))
</script>

{#await initNewProfile() then}
	<UnsavedChangesConfirm
		changed={hasUnsavedChanges}
		undoChanges={undoProfileChanges}
		saveChanges={saveNewProfile} />

	<AvatarInput avtarUrl={avatar} />

	<input type="text" class="input" bind:value={newName} />

	<div class="w-full">
		<h3 class="mb-1 text-lg">A propos de moi</h3>
		<textarea
			class="textarea h-[6em] w-full max-w-prose text-lg"
			bind:value={newDescription} />
	</div>
{/await}
