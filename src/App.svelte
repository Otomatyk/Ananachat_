<script lang="ts">
	import { onDestroy } from "svelte"
	import { isDev } from "./services/deviceSpecs"
	import { initApplication, closeApplication } from "./services/appLifeCycle"
	import { currentProfile } from "./services/user"

	onDestroy(() => {
		closeApplication()
	})
</script>

<div class="h-screen w-screen overflow-hidden bg-base-100 text-base-content">
	{#await initApplication()}
		<div class="flex size-full flex-col items-center justify-center gap-10">
			<h1 class="flex gap-[0.5ch] text-2xl font-semibold lg:text-3xl">
				En cours de chargement ...
			</h1>
			<img
				src="public/stopwatch.png"
				alt=""
				class="size-28 animate-wiggle animate-infinite" />
		</div>
	{:then}
		{#if isDev}
			{#await import("./features/miscellaneous/DebugPannel.svelte") then module}
				<svelte:component this={module.default} />
			{/await}
		{/if}

		{#if $currentProfile.id}
			{#await import("./features/Main.svelte") then module}
				<svelte:component this={module.default} />
			{/await}
		{:else}
			{#await import("./features/page-auth/AuthPage.svelte") then module}
				<svelte:component this={module.default} />
			{/await}
		{/if}
	{/await}
</div>
