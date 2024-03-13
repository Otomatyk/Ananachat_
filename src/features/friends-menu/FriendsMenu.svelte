<script lang="ts">
	import FriendsRequests from "./FriendsRequests.svelte"
	import Popup from "../../components/Popup.svelte"
	import Alert from "../../components/Alert.svelte"

	import type { Relation } from "../../types/records"
	import type { oncloseCallback } from "../../types/miscellaneous"
	import { friendShips } from "./friendsRequests"

	import { pb } from "../../lib/typescript/pb"
	import { currentProfile } from "../../services/user"

	export let onclose: oncloseCallback

	let friendUsername = ""
	let sendInvitePopup = false
	let errorMessage = "",
		successMessage = ""

	function closeSendInvitePopup() {
		;(errorMessage = ""), (successMessage = ""), (friendUsername = "")
		sendInvitePopup = false
	}

	async function sendFriendRequest() {
		errorMessage = ""
		successMessage = ""

		let friendId: Relation

		try {
			const { id } = await pb
				.collection("users_profiles")
				.getFirstListItem(`username = "${friendUsername}"`)
			friendId = id

			if (friendId === $currentProfile.id) {
				errorMessage =
					"Impossible d'envoyer une demande d'amis à sois-même"
				return
			}
		} catch {
			errorMessage = "L'utilisateur associé à ce nom est introuvable"
			return
		}

		try {
			const { state, to } = await pb
				.collection("friends_requests")
				.getFirstListItem(
					`(from = "${$currentProfile.id}" && to = "${friendId}") || (from = "${friendId}" && to = "${$currentProfile.id}")`,
					{
						fields: "state,to",
					},
				)

			if (state === 1) {
				errorMessage = "Tu es déjà amis avec cet utilisateur !"
			} else if (to === $currentProfile.id) {
				errorMessage =
					"Cet utilisateur t'as déjà envoyé une demande d'amis !"
			} else {
				errorMessage =
					"Tu as déjà envoyé une demande d'amis à cet utilisateur!"
			}

			return
		} catch {
			// Run conteinues running only if the record hasn't been found
		}

		try {
			await pb.collection("friends_requests").create({
				from: $currentProfile.id,
				to: friendId,
				state: 0,
			})
		} catch (err) {
			console.error(err)
			errorMessage = "Something went wrong while processing your request"
			return
		}

		successMessage = "Demande d'ami envoyé !"
	}
</script>

{#if sendInvitePopup}
	<Popup onclose={closeSendInvitePopup} title="Envoyer une demande d'amis">
		<form on:submit|preventDefault={sendFriendRequest} class="my-5 w-full">
			<label class="form-control w-full">
				<span>Nom d'utilisateur</span>

				<div class="relative w-full">
					<input
						type="text"
						class="input input-lg w-full"
						placeholder="weal60t ..."
						bind:value={friendUsername} />

					<div class="absolute right-0 top-0 p-2">
						<button
							class="btn btn-primary"
							disabled={friendUsername === ""}>Envoyer</button>
					</div>
				</div>
			</label>

			<p class="an-muted-text max-w-prose">
				Tu peux envoyer une demande d'amis à partir du nom unique (Nom
				d'utilisateur) d'un utilisateur. Le tiens est "{$currentProfile.username}"
			</p>

			<Alert message={errorMessage} type="error" />
			<Alert message={successMessage} type="success" />
		</form>
	</Popup>
{/if}

<Popup size="full" {onclose} title="Demandes d'amis">
	{#if $friendShips.filter(friendship => friendship.state === 0).length > 0}
		<FriendsRequests />

		<div class="absolute bottom-0 left-0 flex w-full justify-end p-5">
			<button
				class="btn btn-success w-full sm:w-fit"
				on:click={() => (sendInvitePopup = true)}
				>Ajouter un ami</button>
		</div>
	{:else}
		<div class="flex w-full justify-center">
			<div
				class="flex h-[60vh] w-screen max-w-screen-sm flex-col items-center justify-center gap-5 overflow-hidden">
				<div class="size-40 rounded-full bg-primary p-8">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16"
						width="20"
						viewBox="0 0 640 512"
						class="an-static-color h-full w-full fill-white"
						><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
							d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" /></svg>
				</div>

				<p class="text-center text-lg">
					Tu n'as aucune demandes d'amis en attente.
				</p>

				<button
					class="btn btn-primary"
					on:click={() => (sendInvitePopup = true)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16"
						width="14"
						viewBox="0 0 448 512"
						class="an-static-color aspect-square h-full fill-primary-content"
						><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
							d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" /></svg>
					Envoyer une demande d'amis
				</button>
			</div>
		</div>
	{/if}
</Popup>
