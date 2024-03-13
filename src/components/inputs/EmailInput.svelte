<script lang="ts">
	import { type Writable } from "svelte/store"

	export let email: Writable<string>
	export let error: string | boolean = false
</script>

<label class="form-control">
	<span>
		<slot>Email</slot>
	</span>

	<input
		type="email"
		placeholder="example@mail.com"
		name="email"
		autocomplete="email"
		bind:value={$email}
		class="input {error ? 'input-error' : ''}"
		{...$$props} />

	{#if typeof error === "string"}
		<div class="label">
			<span class="label-text-alt text-lg text-error">
				{error}
			</span>
		</div>
	{/if}
</label>
