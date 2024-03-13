// Use classes in this directory with Depdency Injection in `currentConvStore`

import type { UnsubscribeFunc, RecordSubscription } from "pocketbase"
import type { Relation, MessageWithAuthor, Message } from "../../types/records"
import { userProfileCache } from "../../lib/typescript/caches"

export class BaseConversation {
	protected _unsubscribeLast: UnsubscribeFunc | null = null
	protected readonly iconOptions = { thumb: "256x256" }
	protected readonly messageFields =
		"images, content, author, created, updated, collectionId, id"

	public recordId!: Relation
	public ready = false
	public canEdit = false

	constructor(recordConvId: Relation) {
		this.recordId = recordConvId
	}

	finalizeInit() {
		this.ready = true
	}

	async subscribeAndUnsubscribe(unsubscribe: UnsubscribeFunc) {
		await this.unsubscribe()

		this._unsubscribeLast = unsubscribe
		console.debug("Subscribed to conversation")
	}

	async unsubscribe() {
		if (!this._unsubscribeLast) return

		await this._unsubscribeLast()
		console.debug("Unsubscribed to conversation")
	}

	async normalizeEventRecord(ev: RecordSubscription<Message>) {
		return {
			action: ev.action,
			record: {
				...(await BaseConversation.normalizeMessages(ev.record))[0],
			},
		}
	}

	static async normalizeMessages(...messages: Message[]) {
		return (await Promise.all<MessageWithAuthor>(
			messages.map(async msg => {
				return {
					...msg,
					authorProfile: await userProfileCache.get(msg.author),
				}
			}),
		)) as MessageWithAuthor[]
	}
}
