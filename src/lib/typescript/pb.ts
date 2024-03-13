import type {
	Channel,
	ChannelMember,
	ChannelMessage,
	DMMessage,
	FriendRequest,
	Invite,
	UserProfile,
} from "../../types/records"

import PocketBase, { RecordService, type AuthModel } from "pocketbase"

import { afterPbInit } from "./internal"

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService // default fallback for any other collection
	collection(idOrName: "friends_requests"): RecordService<FriendRequest>
	collection(idOrName: "channels"): RecordService<Channel>
	collection(idOrName: "messages"): RecordService<ChannelMessage>
	collection(idOrName: "users_profiles"): RecordService<UserProfile>
	collection(idOrName: "dms"): RecordService<DMMessage>
	collection(idOrName: "invites"): RecordService<Invite>
	collection(idOrName: "channels_members"): RecordService<ChannelMember>
}

// http://127.0.0.1:5173
// 192.168.1.30:8080
export let pb = new PocketBase("http://127.0.0.1:8090") as TypedPocketBase
afterPbInit.pbIsInit()

export let toUnsuscribe = new (class {
	private unsubscribersList: Array<[string, Function]> = []

	public add(provider: string, unsubscriber: Function) {
		this.unsubscribersList.push([provider, unsubscriber])
	}

	/**
	 * @deprecated
	 */
	public push(ele: [string, Function]) {
		this.unsubscribersList.push(ele)
	}

	public unsubscribesAll() {
		if (this.unsubscribersList.length === 0) {
			console.log("No Subscriptions to unsubscribe")
			return
		}

		console.log("Subscriptions :")
		console.log(this.unsubscribersList.map(ele => ele[0]))

		this.unsubscribersList.forEach(ele => ele[1]())

		console.log("Succesfully unsuscribe all internal")
	}
})()
