import type { ConversationSpecs } from "./convTypes"
import type { UserProfile, Channel } from "../../types/records"
import { pb } from "../../lib/typescript/pb"
import { currentProfile as currentProfileStore } from "../../services/user"

let currentProfile: UserProfile
currentProfileStore.subscribe(profile => (currentProfile = profile))

export function convertToConversationSpecs(
	record: Channel | UserProfile,
): ConversationSpecs {
	const isChannel = record.collectionName === "channels"

	return {
		recordId: record.id,
		ready: true,
		type: isChannel ? "channel" : "dm",

		title: isChannel ? "# " + record.name : record.displayname,
		pureTitle: isChannel ? record.name : record.displayname,
		description: isChannel ? record.description : "",

		canEdit: isChannel ? record.admin === currentProfile.id : false,
		owner: isChannel ? record.admin : "",

		iconUrl: pb.files.getUrl(
			record,
			isChannel ? record.icon : record.avatar,
		),
	}
}
