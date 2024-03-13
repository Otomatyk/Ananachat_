import type {
	Relation,
	MessageWithAuthor,
	UserProfile,
} from "../../types/records"
import type { RecordSubscription } from "pocketbase"
import type { Conversation } from "./convTypes"
import { pb } from "../../lib/typescript/pb"
import { userProfileCache } from "../../lib/typescript/caches"
import { BaseConversation } from "./baseConv"
import { currentProfile as currentProfileStore } from "../user"
import { currentConvStore } from "./convStore"
import { convertPbDatetime } from "../../utils/dates"

let currentProfile: UserProfile
currentProfileStore.subscribe(profile => (currentProfile = profile))

export class DMConversation extends BaseConversation implements Conversation {
	public title = "Conversation privé sans nom"
	public pureTitle = "Conversation privé sans nom"
	public iconUrl = ""
	public membersIds: Relation[] = []
	public created!: string

	public readonly description = ""
	public readonly type = "dm"
	public readonly owner = ""
	public readonly showDropdownMembers = false

	public messages = {
		leave: {
			title: "",
			body: "Es-tu sûr de vouloir retirer cet ami ?",
			menu: "Retirer l'ami",
		},

		"here-since": "",
		"created-in": "",
	}

	private friendshipId!: Relation

	constructor(friendId: Relation) {
		super(friendId)

		this.init()
	}

	private async init() {
		const FRIEND_PROFILE = await userProfileCache.get(this.recordId)

		this.pureTitle = this.title = FRIEND_PROFILE.displayname
		this.messages.leave.title = `Retirer ${FRIEND_PROFILE.displayname}`
		this.iconUrl = pb.files.getUrl(
			FRIEND_PROFILE as { [key: string]: any },
			FRIEND_PROFILE.avatar,
			this.iconOptions,
		)

		const FRIENDS_REQUEST: { id: Relation; created: string } = await pb
			.collection("friends_requests")
			.getFirstListItem(
				`(from = "${currentProfile.id}" && to = "${this.recordId}") || (from = "${this.recordId}" && to = "${currentProfile.id}")`,
				{
					fields: "id,created",
				},
			)

		this.friendshipId = FRIENDS_REQUEST.id

		this.membersIds = [currentProfile.id, this.recordId]

		this.messages["here-since"] =
			`Amis depuis le ${convertPbDatetime(FRIENDS_REQUEST.created)}`

		super.finalizeInit()
		currentConvStore.set(this)
	}

	async deleteMessage(id: Relation) {
		await pb.collection("dms").delete(id)
	}

	async sendMessage(content: string, images: File[]) {
		await pb.collection("dms").create({
			content,
			images,
			author: currentProfile.id,
			friendship: this.friendshipId,
		})
	}

	async fetchRecentMessages() {
		let messages = (
			await pb.collection("dms").getList(1, 10, {
				fields: `${this.messageFields}`,
				filter: `friendship.id = "${this.friendshipId}"`,
				sort: "-created",
			})
		).items

		return await BaseConversation.normalizeMessages(...messages)
	}

	async subscribe(
		callback: (data: RecordSubscription<MessageWithAuthor>) => any,
	) {
		super.subscribeAndUnsubscribe(
			await pb.collection("dms").subscribe("*", async ev => {
				callback({
					action: ev.action,
					record: {
						...(
							await BaseConversation.normalizeMessages(ev.record)
						)[0],
					},
				})
			}),
		)
	}

	async leave() {
		console.warn(
			await pb
				.collection("friends_requests")
				.update(this.friendshipId, { state: -1 }),
		)
	}

	async refresh() {
		userProfileCache.remove(this.recordId)
		await this.init()
	}

	async changeOwner(newOwnerId: Relation) {}
	async update(newDescription: string, newTitle: string) {}
	async kickMember(memberId: string) {}
}
