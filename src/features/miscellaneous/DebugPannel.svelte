<script lang="ts">
	import { currentConvStore } from "../../services/conv/convStore";
	import { isMobile } from "../../services/deviceSpecs";
	import { pb } from "../../lib/typescript/pb";
	

    let loggedInFromPb = pb.authStore.isValid

    pb.authStore.onChange((v) => {
        loggedInFromPb = pb.authStore.isValid
    })

    let reload = 0;
    let hidden = false

    let counterConvChanged = 0
    currentConvStore.subscribe(() => counterConvChanged++)
</script>

{#if !hidden}
	<ol
		class="md:text-md font-mono fixed right-0 top-0 z-50 flex flex-col rounded-bl-2xl
        bg-base-100 p-4 text-sm font-bold text-error-content">
		{#key reload}
			<li>Mobile : {$isMobile}</li>
			<li>Logged in (From `pb`): {loggedInFromPb}</li>
			<li>Logged in (From `loggedIn`): {$loggedInStore}</li>

			{#if $loggedInStore}
				<li>Displayname : {userProfileRecord?.displayname}</li>
				<li>Id : {userProfileRecord?.id}</li>
				<li>Conv : {$currentConvStore}</li>
				<li>Conv changed {counterConvChanged} times</li>

				{#if $currentConvStore}
					<li>
						Current conv : {$currentConvStore.recordId}<br />
						{$currentConvStore.title}<br />
						{$currentConvStore.type}
					</li>
				{/if}
			{/if}

			<li class="mt-4 grid grid-cols-3 gap-2">
				<button on:click={() => pb.authStore.clear()}>Log out</button>
				<button on:click={() => reload++}>Reload debug pannel</button>
				<button on:click={() => (hidden = true)}
					>Hide debug pannel</button>
			</li>
		{/key}
	</ol>
{/if}

<style lang="postcss">
	li:not(:has(button)) {
		pointer-events: none;
	}

	button {
		@apply btn btn-error btn-xs;
	}
</style>
