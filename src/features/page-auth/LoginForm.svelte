<script lang="ts">
	import PasswordInput from "../../components/inputs/PasswordInput.svelte"
	import EmailInput from "../../components/inputs/EmailInput.svelte"

	import { writable } from "svelte/store"
	import { pb } from "../../lib/typescript/pb"

	let password = writable("")
	let email = writable("")

	let errorMessage = "",
		loading = false

	async function logInWithPwd() {
		loading = true
		errorMessage = ""

		try {
			await pb.collection("users").authWithPassword($email, $password)
			console.log("Logged in ...")
		} catch (error) {
			errorMessage = "Email et/ou mot de passe invalides"
		} finally {
			loading = false
		}
	}
</script>

<form class="w-full" on:submit|preventDefault={logInWithPwd}>
	<EmailInput {email} error={errorMessage != ""} required />

	<PasswordInput
		{password}
		error={errorMessage}
		required
		autocomplete="current-password" />

	<button
		class="btn btn-primary mt-2 w-full text-lg"
		type="submit"
		disabled={loading}>
		{#if loading}
			<span class="loading loading-spinner" />
		{/if}

		Se connecter
	</button>
</form>
