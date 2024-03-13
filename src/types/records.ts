import { type RecordModel } from "pocketbase"

export type Relation = string
export type FileName = string

export interface UserProfile extends RecordModel {
	avatar: string
	displayname: string
	description: string
	username: string
	user: Relation
}

export interface Message extends RecordModel {
	content: string
	author: Relation
	images: FileName[]
}

export interface MessageWithAuthor extends RecordModel {
	content: string
	authorProfile: UserProfile
	images: FileName[]
}

export interface DMMessage extends Message {
	friendship: Relation
}

export interface ChannelMessage extends Message {
	channel: Relation
}

export interface Channel extends RecordModel {
	name: string
	description: string

	admin: Relation
	members: Relation[]
	icon: string
}

export interface FriendRequest extends RecordModel {
	from: Relation
	to: Relation
	state: -1 | 0 | 1
}

export interface Invite extends RecordModel {
	used_by: Relation[]
	channel: Relation
	password: string
}

export interface ChannelMember extends RecordModel {
	accepted: boolean
	channel: Relation
	to: Relation
}
