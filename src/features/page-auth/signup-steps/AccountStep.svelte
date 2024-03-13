<script lang="ts">
	export let actualStep: Writable<number>

	import PasswordInput from "../../../components/inputs/PasswordInput.svelte"
	import EmailInput from "../../../components/inputs/EmailInput.svelte"

	import { writable, type Writable } from "svelte/store"
	import { pb } from "../../../lib/typescript/pb"

	let email = writable(""),
		password = writable(""),
		displayname = ""
	let error = ""

	async function createUser() {
		error = ""

		if (!$password.match(/(.*[a-z].*[A-Z].*|.*[A-Z].*[a-z].*)/g)) {
			error = "Ne contient pas une majuscule ET une minuscule"
			return
		}

		actualStep.update(step => step + 1)
	}
</script>

<form class="w-full" on:submit|preventDefault={createUser}>
	<EmailInput {email} required />

	<PasswordInput {password} {error} required minlength="8" />

	<p class="an-deemphasized-text -translate-y-4">
		Ton mot de passe doit faire au moins 8 caractéres,<br />
		et contenir une majuscule et une minuscule.
	</p>

	<button class="btn btn-primary mt-4 w-full text-lg" type="submit">
		Prochaine étape
	</button>

	<span class="an-deemphasized-text mt-2 block w-full text-center text-sm">
		(Il sera impossible de retourner en arrière)
	</span>
</form>
