<script lang="ts">
	export let isOwner: boolean

	import type { ComponentType } from "svelte"
	import type { Relation } from "../../types/records"
	import { userProfileCache } from "../../lib/typescript/caches"
	import { currentConvStore } from "../../services/conv/convStore"
	import { pb } from "../../lib/typescript/pb"
	import { currentProfile } from "../../services/user"

	let showedPopup: Promise<{ default: ComponentType }> | null = null
	let popupAttrs = {}

	async function kickMember(memberId: Relation) {
		popupAttrs = { kickedMember: await userProfileCache.get(memberId) }
		showedPopup = import("./KickMember.svelte")
	}
</script>

{#if showedPopup}
	{#await showedPopup then module}
		<svelte:component
			this={module.default}
			{...popupAttrs}
			onclose={() => (showedPopup = null)} />
	{/await}
{/if}

<h2 class="text-lg">{$currentConvStore.membersIds.length} Membres</h2>
<p class="an-deemphasized-text text-sm">
	Clique sur un membre pour réaliser une action
</p>

<ul class="my-4 flex w-full flex-col gap-6">
	<!-- If it doesn't just use $currentConvStore.membersIds, it's to puts the current user at the top -->

	{#each [$currentProfile.id, ...$currentConvStore.membersIds.filter(ele => ele !== $currentProfile.id)] as memberId (memberId)}
		{@const isSelf = $currentProfile.id === memberId}
		{@const interactive = isOwner || isSelf}

		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<li
			tabindex={interactive ? 0 : -1}
			class="an-outset-box-md collapse bg-base-200 {interactive
				? 'collapse-arrow focus-within:collapse-open'
				: 'collapse-close'}">
			<div
				class="collapse-title flex items-center gap-4 {interactive
					? ''
					: '!cursor-default'}">
				{#await userProfileCache.get(memberId) then member}
					<img
						src={pb.files.getUrl(member, member.avatar)}
						alt=""
						class="avatar" />

					<p
						class="inline-flex max-w-48 items-center gap-3 truncate text-lg">
						{member.displayname}

						{#if isSelf}
							<span class="an-deemphasized-text text-sm" hidden>
								(Toi)
							</span>
						{/if}

						{#if member.id === $currentConvStore.owner}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								id="crown"
								viewBox="0 0 576 512"
								class="an-static-color size-5 fill-amber-500"
								><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
									d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" /></svg>
						{/if}
					</p>
				{/await}
			</div>

			<div class="collapse-content flex w-full gap-3 *:flex-1">
				{#if isSelf}
					<button
						class="btn btn-error btn-sm w-full"
						on:click={() => (showedPopup = "ConfirmLeaveGroup")}>
						Quitter le groupe
					</button>
				{:else if interactive}
					<button class="btn btn-error btn-sm">
						Leguer la propriété
					</button>

					<button
						class="btn btn-error btn-sm"
						on:click={() => kickMember(memberId)}>
						Expluser
					</button>
				{/if}
			</div>
		</li>
	{/each}
</ul>
