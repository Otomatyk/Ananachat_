import type { FriendRequest } from "../../types/records"
import { writable } from "svelte/store"
import { pb, toUnsuscribe } from "../../lib/typescript/pb"

export let friendShips = writable<FriendRequest[]>([])

export async function initFriendsRequest() {
	const friendsReqs = await pb.collection("friends_requests").getFullList()

	friendShips.set(friendsReqs)

	await subscribeFriendsRequests()
}

async function subscribeFriendsRequests() {
	toUnsuscribe.push([
		"Friends requests",
		await pb.collection("friends_requests").subscribe("*", event => {
			if (event.action === "create")
				friendShips.update(reqs => [...reqs, event.record])
			else if (event.action === "delete")
				friendShips.update(reqs =>
					reqs.toSpliced(
						reqs.findIndex(req => req.id === event.record.id),
						1,
					),
				)
			else if (event.action === "update") {
				friendShips.update(reqs => {
					let updated = reqs
					updated[reqs.findIndex(req => req.id === event.record.id)] =
						event.record
					return updated
				})
			}
		}),
	])
}
