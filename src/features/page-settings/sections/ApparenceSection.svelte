<script lang="ts">
	let actualTheme = document.body.getAttribute("data-theme")

	function changeTheme(themeName: string) {
		const FULL_THEME_NAME = `ananachat-${themeName}`

		actualTheme = FULL_THEME_NAME

		document.body.setAttribute("data-theme", FULL_THEME_NAME)
		localStorage.setItem("theme", FULL_THEME_NAME)
	}
</script>

<!--flex items-center justify-start-->
<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
	{#each [{ name: "Sombre", "data-theme": "dark", color: "#172554" /*blue-950*/ }, { name: "Néant", "data-theme": "black", color: "#0e0b1b" }, { name: "Clair", "data-theme": "light", color: "#0284c7" /*sky-600*/ }, { name: "Sakura", "data-theme": "sakura", color: "#f5d0fe" /*fushia-200*/ }] as theme}
		<div
			class="an-outset-box-lg has-[:checked]:an-retracted-outset-box group relative flex flex-col items-center gap-4 rounded-box bg-base-100 p-5 has-[:checked]:brightness-75"
			data-theme="ananachat-{theme['data-theme']}">
			<img
				src="src/assets/{theme['data-theme']}-mode.png"
				alt=""
				class="aspect-square w-16" />

			<label
				class="w-fit rounded-btn text-xl tracking-wide"
				for={theme.name}>
				{theme.name}
			</label>

			<input
				type="radio"
				class="absolute left-0 top-0 size-full opacity-0"
				value={theme.name}
				name="radio-theme"
				checked={`ananachat-${theme["data-theme"]}` === actualTheme}
				on:change={() => changeTheme(theme["data-theme"])} />
		</div>
	{/each}
</div>

<style>
	img {
		filter: drop-shadow(0px 3px 0px rgba(0, 0, 0, 0.75));
	}
</style>
