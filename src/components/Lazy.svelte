<script lang="ts">
	import type { ComponentType } from "svelte"

	export let component: Promise<{ default: ComponentType }>
</script>

{#await component then exports}
	<svelte:component this={exports.default} />
{/await}
