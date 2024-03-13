<script lang="ts">
	import AccountStep from "./signup-steps/AccountStep.svelte"
	import ProfileStep from "./signup-steps/ProfileStep.svelte"

	import { writable } from "svelte/store"
	import { pb } from "../../lib/typescript/pb"

	let email = writable(""),
		password = writable(""),
		displayname = ""

	let badAuth = false,
		loading = false

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
	$: username = displayname.toLowerCase().replaceAll(" ", "_").slice(0, 10)

	/*let i = 0
    $: {
        if(!displayname) {
            while(alreadyTakenUsernames.includes(username) || username.length < 3) username += (i++) % 9
        }
    } */

	let actualStep = writable(0)
	const STEPS = [0, 1, 2]

	async function singUpWithPwd() {
		loading = true
		badAuth = false

		try {
			const USER_RECORD = await pb.collection("users").create({
				$email,
				$password,
				passwordConfirm: $password,
				username: displayname,
			})

			console.log("Sing up ...")

			await pb.collection("users").authWithPassword($email, $password)

			const createAvatar = (await import("@dicebear/core")).createAvatar
			const botttsNeutralCollection = (
				await import("@dicebear/collection")
			).botttsNeutral

			const avatar = await createAvatar(botttsNeutralCollection, {
				size: 256,
				seed: username,
			})
				.png()
				.toArrayBuffer()

			const profileId = (
				await pb.collection("users_profiles").create({
					user: USER_RECORD.id,
					avatar: new Blob([avatar]),
					username,
					displayname,
				})
			).id

			await pb.collection("users").update(USER_RECORD.id, {
				profile: profileId,
			})

			console.log("Created profiled ...")

			window.location.reload()
		} catch (error) {
			badAuth = true
		} finally {
			loading = false
		}
	}
</script>

{#if $actualStep === 0}
	<AccountStep {actualStep} />
{:else}
	<ProfileStep />
{/if}

<!--
<form class="w-full" on:submit|preventDefault={nextStep}>
    <button class="btn btn-primary text-lg w-full mt-4" type="submit">
        {#if loading}
            <span class="loading loading-spinner"/>
        {/if}

        {actualStep === STEPS.at(-1) ? "Créer le compte" : "Prochaine étape"}
    </button>
    {#if $actualStep > 0}        
        <button class="text-primary absolute top-4 left-4 inline-flex items-center gap-2" on:click={() => $actualStep -= 1}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="size-3 an-static-color fill-primary">!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
            
            Revenir en arrière
        </button>
    {/if}
-->

<ul
	class="steps steps-horizontal absolute bottom-3 left-0 mt-8 w-full px-4 md:static">
	{#each STEPS as step}
		<li class="step {$actualStep >= step ? 'step-primary' : ''}" />
	{/each}
</ul>
