<script lang="ts">
	export let message: string
	export let type: "error" | "success" = "error"

	let disable = false

	/*$: {
        message
 animate-fade
        disable = false
        setTimeout(() => {disable = true}, 5000)
    }*/
</script>

{#if message}
	<div
		class="toast animate-delay-[4.5s] animate-reverse animate-duration-500 animate-once animate-ease-in-out max-md:w-fit"
		style:pointer-events={disable ? "none" : "all"}>
		<strong
			class="alert flex font-normal shadow-md {{
				error: 'alert-error',
				success: 'alert-success',
			}[type]}"
			role="alert">
			{#if type === "error"}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="16"
					width="16"
					viewBox="0 0 512 512"
					class="an-static-color size-6 fill-error-content"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
						d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg>
			{:else if type === "success"}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="16"
					width="16"
					viewBox="0 0 512 512"
					class="an-static-color size-6 fill-success-content"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
						d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z" /></svg>
			{/if}

			{message}
		</strong>
	</div>
{/if}
