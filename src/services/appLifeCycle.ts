import type { UserProfile } from "../types/records"
import { get } from "svelte/store"
import { DMConversation } from "./conv/dmConversation"
import { GroupConversation } from "./conv/groupConversation"
import { currentConvStore } from "./conv/convStore"
import { toUnsuscribe, pb } from "../lib/typescript/pb"
import { reloadUser, currentProfile as currentProfileStore } from "./user"

let currentProfile: UserProfile
currentProfileStore.subscribe(profile => (currentProfile = profile))

export async function initApplication() {
	console.trace("Used initApplication")

	toUnsuscribe.add(
		"UserProfile, reloadUser",

		await pb.collection("users_profiles").subscribe("*", async req => {
			if (
				req.action != "create" ||
				req.record.user != pb.authStore.model?.id
			)
				return

			// When user has just signed up, refresh his profile
			await reloadUser()
		}),
	)

	// Should be at the end of the function,
	// otherwise, UI will update before all user's data are updated
	if (!pb.authStore.isValid) {
		// loggedInStore.set(pb.authStore.model != undefined);
		return
	}

	const LAST_VISITED_CONV_STR = localStorage.getItem("last_visited_conv")

	if (LAST_VISITED_CONV_STR) {
		const LAST_CONV: { id: string; type: "channel" | "dm" } = JSON.parse(
			LAST_VISITED_CONV_STR,
		)

		try {
			if (LAST_CONV.type === "channel")
				await pb
					.collection("channels_members")
					.getFirstListItem(
						`channel = "${LAST_CONV.id}" && to = "${currentProfile.id}"`,
						{ fields: "" },
					)
			else if (LAST_CONV.type === "dm") {
				await pb
					.collection("friends_requests")
					.getFirstListItem(
						`(to = "${currentProfile.id}" || from = "${currentProfile.id}") && state = 1`,
					)
			}

			const convClass =
				LAST_CONV.type === "channel"
					? GroupConversation
					: DMConversation

			currentConvStore.set(new convClass(LAST_CONV.id))
		} catch {
			// The record hasn't been found so
			// the user no longer has access to the conversation
		}
	}

	const initFriendsRequests = (
		await import("../features/friends-menu/friendsRequests")
	).initFriendsRequest
	await initFriendsRequests()
}

export function closeApplication() {
	console.log("Starting closing application")

	const conv = get(currentConvStore)

	if (conv) {
		localStorage.setItem(
			"last_visited_conv",
			JSON.stringify({
				id: conv.recordId,
				type: conv.type,
			}),
		)
	}

	toUnsuscribe.unsubscribesAll()
}
