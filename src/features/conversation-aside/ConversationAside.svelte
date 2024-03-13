<script lang="ts">
	import MembersActions from "./MembersActions.svelte"

	import { onDestroy, type ComponentType } from "svelte"
	import { currentConvStore } from "../../services/conv/convStore"
	import { currentProfile } from "../../services/user"

	let showedPopup: Promise<{ default: ComponentType }> | null = null
	let popupAttrs = {}

	let editingGroup = false
	$: isOwner = $currentConvStore.owner === $currentProfile.id

	function closePopup() {
		showedPopup = null
		popupAttrs = {}
	}
</script>

{#if showedPopup}
	{#await showedPopup then module}
		<svelte:component
			this={module.default}
			onclose={closePopup}
			{...popupAttrs} />
	{/await}
{/if}

<aside
	class="relative flex h-screen w-screen max-w-md transform-none flex-col gap-7 overflow-y-hidden bg-base-300"
	on:touchmove|stopPropagation>
	<div class="w-full rounded-b-full border-t-4 border-primary/70" />

	<header class="w-full px-7">
		<div class="flex items-start gap-3">
			<img src={$currentConvStore.iconUrl} alt="" class="avatar size-8" />

			<div class="flex flex-col justify-center">
				<h1 class="text-xl">{$currentConvStore.title}</h1>
				<p class="an-deemphasized-text text-base">
					{$currentConvStore.description}
				</p>
			</div>
		</div>
	</header>

	<section class="flex flex-grow flex-col overflow-auto px-5">
		{#if editingGroup}
			{#await import("./EditGroup.svelte") then module}
				<svelte:component
					this={module.default}
					onclose={() => (editingGroup = false)} />
			{/await}
		{:else}
			<MembersActions {isOwner} />

			<p class="an-muted-text mt-3 w-full px-2 text-left">
				{$currentConvStore.messages["here-since"]} <br />
				{$currentConvStore.messages["created-in"]}
			</p>
		{/if}
	</section>

	{#if isOwner && !editingGroup}
		<div class="grid w-full grid-cols-2 gap-4 bg-base-100 p-5">
			<button
				class="btn btn-success"
				on:click={() => (showedPopup = import("./AddMembers.svelte"))}>
				Ajouter des membres
			</button>

			<button
				class="btn btn-primary"
				on:click={() => (editingGroup = true)}>
				Editer le groupe
			</button>
		</div>
	{/if}
</aside>
