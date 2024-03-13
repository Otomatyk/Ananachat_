import type { RecordSubscription } from "pocketbase"
import type { MessageWithAuthor, Relation } from "../../types/records"

type convMessage = { title: string; body: string } & object

export interface ConversationSpecs {
	recordId: Relation
	ready: boolean
	type: "channel" | "dm"

	iconUrl: string

	title: string
	pureTitle: string
	description: string

	canEdit: boolean
	owner: Relation
}

export interface Conversation extends ConversationSpecs {
	messages: {
		leave: convMessage & { menu: string }
		"created-in": string
		"here-since": string
	} & Object

	sendMessage(content: string, images: File[]): Promise<void>
	deleteMessage(id: Relation): Promise<void>
	fetchRecentMessages(): Promise<MessageWithAuthor[]>
	leave(): Promise<void>
	refresh(): Promise<void>

	subscribe(
		callback: (data: RecordSubscription<MessageWithAuthor>) => any,
	): Promise<void>
	unsubscribe(): Promise<void>

	showDropdownMembers: boolean
	membersIds: Relation[]
	kickMember(memberId: Relation): Promise<void>
	changeOwner(newOwnerId: Relation): Promise<void>
	update(newTitle: string, newDescription: string): Promise<void>
}
