import type { Relation, UserProfile } from "../types/records"
import { readable } from "svelte/store"
import { pb } from "../lib/typescript/pb"

/* 
Don't check if user is logged in like this
    if($currentProfile) {...}
But like this
    if($currentProfile.id) {...}
*/

const EMPTY_PROFILE: UserProfile = {
	avatar: "",
	displayname: "",
	username: "",
	user: "",
	description: "",
	collectionId: "",
	collectionName: "",
	id: "",
	created: "",
	updated: "",
}

export const currentProfile = readable<UserProfile>(EMPTY_PROFILE, set => {
	const fetchProfile = async () =>
		await pb
			.collection("users_profiles")
			.getFirstListItem(`user = "${pb.authStore.model?.id}"`)

	if (pb.authStore.isValid) {
		fetchProfile().then(profile => {
			set(profile)
		})
	}

	return pb.authStore.onChange(async token => {
		if (token) set(await fetchProfile())
		else set(EMPTY_PROFILE)
	})
})

export async function logOut() {
	localStorage.removeItem("last_visited_conv")

	pb.authStore.clear()
}

export async function reloadUser() {
	// Return if the function that called reoladUser shoud exit
	try {
		/* userProfileRecord = await pb.collection("users_profiles").getFirstListItem(`user.id = "${pb.authStore.model?.id}"`);
        userId = userProfileRecord.id; */
	} catch (error) {
		console.trace()
		console.error("Login fail : " + error)

		// If the user's profile hasn't been found, it means the user is signing up
		return true
	}

	return false
}
