import { readable } from "svelte/store"
import { pb } from "../../lib/typescript/pb"

export async function authWithDiscord() {
	const authData = await pb
		.collection("users")
		.authWithOAuth2({ provider: "discord" })

	if (!authData.meta?.isNew) {
		return
	}

	const discordProfile = authData.meta.rawUser
	let avatar = await fetch(
		`https://cdn.discordapp.com/avatars/${discordProfile.id}/${discordProfile.avatar}.webp?size=256`,
	)

	await pb.collection("users_profiles").create({
		user: authData.record.id,
		username: discordProfile.username,
		displayname: discordProfile.global_name,
		avatar: new Blob([await avatar.arrayBuffer()]),
	})
}

export let socialProviders = readable<string[]>([], set => {
	pb.collection("users")
		.listAuthMethods()
		.then(authMethodList => {
			const OAUTH_PROVIDERS = authMethodList.authProviders.map(
				authProvider => authProvider.name,
			)
			set(OAUTH_PROVIDERS)
		})
})
