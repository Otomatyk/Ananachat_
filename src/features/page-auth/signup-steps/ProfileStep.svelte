<script lang="ts">
	import { pb } from "../../../lib/typescript/pb"

	let generateUsername = true

	let displayname = ""
	let alreadyTakenUsernames: string[] = []

	pb.collection("users_profiles")
		.getFullList({ fields: "username" })
		.then(
			usersProfiles =>
				(alreadyTakenUsernames = usersProfiles.map(
					profile => profile.username,
				)),
		)

	let username = ""
	$: {
		if (generateUsername) {
			username = displayname
				.toLowerCase()
				.replaceAll(" ", "_")
				.slice(0, 10)
		}
	}

	async function createProfile() {}
</script>

<form class="w-full" on:submit|preventDefault={createProfile}>
	<div class="mb-3 grid w-full grid-cols-2 gap-3">
		<label class="form-control mb-0">
			<span>Nom d'utilisateur</span>
			<input
				type="text"
				required
				placeholder="Az123"
				autocomplete="username"
				bind:value={displayname}
				class="input" />
		</label>

		<label class="form-control mb-0">
			<span>Nom unique</span>
			<input
				class="input {generateUsername ? 'input-disabled' : ''}"
				type="text"
				required
				placeholder="az123"
				readonly={generateUsername}
				bind:value={username}
				pattern="[a-z0-9_]+" />
		</label>
	</div>

	<label class="my-5 flex w-full items-center gap-3">
		<input
			type="checkbox"
			class="checkbox-primary checkbox"
			bind:checked={generateUsername} />
		<span class="text-base">Générer automatiquement mon nom unique</span>
	</label>

	<p class="an-deemphasized-text mb-4 text-sm md:text-base">
		Ton nom unique sera utilisé pour rajouter des amis, il faut qu'il soit
		un assez simple à mémoriser.
		<br /> <br />
		Il ne peut contenir que des lettres minuscules, des chiffres et des tirets
		du bas
	</p>

	<button class="btn btn-primary w-full text-lg"> Prochaine étape </button>
</form>
