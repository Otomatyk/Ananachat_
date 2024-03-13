import type {
	Relation,
	MessageWithAuthor,
	UserProfile,
} from "../../types/records"
import type { RecordSubscription, UnsubscribeFunc } from "pocketbase"
import type { Conversation } from "./convTypes"
import { pb } from "../../lib/typescript/pb"
import { BaseConversation } from "./baseConv"
import { groupCache } from "../../lib/typescript/caches"
import { currentProfile as currentProfileStore } from "../user"
import { currentConvStore } from "./convStore"
import { convertPbDatetime } from "../../utils/dates"

let currentProfile: UserProfile
currentProfileStore.subscribe(profile => (currentProfile = profile))

export class GroupConversation
	extends BaseConversation
	implements Conversation
{
	public title = "Groupe sans nom"
	public pureTitle = ""
	public iconUrl = ""
	public description = ""
	public membersIds: Relation[] = []
	public owner!: Relation
	public created!: string

	public readonly type = "channel"
	public readonly showDropdownMembers = true

	public messages = {
		leave: {
			title: "Es-tu sûr de vouloir quitter ce groupe ?",
			body: "Tu ne pourra plus le rejoindre tant que tu ne recois pas une autre invitation",
			menu: "Quitter ce groupe",
		},

		"here-since": "",
		"created-in": "",
	}

	protected _unsubscribeLast: UnsubscribeFunc | null = null

	constructor(groupId: Relation) {
		super(groupId)

		this.init()
	}

	private async init() {
		const GROUP_RECORD = await groupCache.get(this.recordId)

		this.description = GROUP_RECORD.description
		this.title = "# " + GROUP_RECORD.name
		this.pureTitle = GROUP_RECORD.name
		this.canEdit = GROUP_RECORD.admin === currentProfile.id
		this.iconUrl = pb.files.getUrl(
			GROUP_RECORD as { [key: string]: any },
			GROUP_RECORD.icon,
			this.iconOptions,
		)
		this.owner = GROUP_RECORD.admin

		this.membersIds = (
			await pb.collection("channels_members").getFullList({
				filter: `channel = "${this.recordId}"`,
				fields: "to",
			})
		).map(member => member.to)

		const ARRIVAL_DATE = (
			await pb
				.collection("channels_members")
				.getFirstListItem(
					`channel = "${this.recordId}" && to = "${currentProfile.id}"`,
					{
						fields: "created",
					},
				)
		).created

		this.messages["created-in"] =
			`Créer le ${convertPbDatetime(GROUP_RECORD.created)}`
		this.messages["here-since"] =
			`Membre depuis le ${convertPbDatetime(ARRIVAL_DATE)}`

		super.finalizeInit()
		currentConvStore.set(this)
	}

	async deleteMessage(id: Relation) {
		await pb.collection("messages").delete(id)
	}

	async sendMessage(content: string, images: File[]) {
		await pb.collection("messages").create({
			content,
			images,
			author: currentProfile.id,
			channel: this.recordId,
		})
	}

	async fetchRecentMessages(): Promise<MessageWithAuthor[]> {
		console.debug(`Fetch channel messages "${this.recordId}"`)

		const options = {
			fields: `${this.messageFields}`,
			filter: `channel.id = "${this.recordId}"`,
			sort: "-created",
		}

		let messages = (await pb.collection("messages").getList(1, 10, options))
			.items

		return await BaseConversation.normalizeMessages(...messages)
	}

	async subscribe(
		callback: (data: RecordSubscription<MessageWithAuthor>) => any,
	) {
		super.subscribeAndUnsubscribe(
			await pb.collection("messages").subscribe("*", async ev => {
				callback(await this.normalizeEventRecord(ev))
			}),
		)
	}

	async leave() {
		if (this.membersIds.length === 1) {
			// Destroy group forever

			const requestParams = {
				filter: `channel = "${this.recordId}"`,
				fields: "id",
			}

			let messages = await pb
				.collection("messages")
				.getFullList(requestParams)
			let members = await pb
				.collection("channels_members")
				.getFullList(requestParams)

			for await (let msg of messages) {
				await pb.collection("messages").delete(msg.id)
			}

			for await (let member of members) {
				await pb.collection("channels_members").delete(member.id)
			}

			await pb.collection("channels").delete(this.recordId)

			return
		}

		const { id } = await pb
			.collection("channels_members")
			.getFirstListItem(
				`channel = "${this.recordId}" && to = "${currentProfile.id}"`,
			)

		await pb.collection("channels_members").delete(id)
	}

	async refresh() {
		groupCache.remove(this.recordId)
		await this.init()
	}

	async changeOwner(newOwnerId: Relation) {
		if (!this.membersIds.includes(newOwnerId))
			throw new Error(
				"Impossible de changer de propriétaire si ce dernier n'est pas dans le grope concerné !",
			)

		await pb
			.collection("channels")
			.update(this.recordId, { admin: newOwnerId })
		await this.refresh()
	}

	async update(newTitle: string, newDescription: string) {
		await pb.collection("channels").update(this.recordId, {
			name: newTitle,
			description: newDescription,
		})

		await this.refresh()
	}

	async kickMember(memberId: string) {
		const { id } = await pb
			.collection("channels_members")
			.getFirstListItem(
				`channel = "${this.recordId}" && to.id = "${memberId}"`,
			)

		await pb.collection("channels_members").delete(id)
	}
}
