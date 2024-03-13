<script lang="ts">
	export let srLabel = "Changer l'avatar"
	export let avtarUrl: Writable<File>

	import type { Writable } from "svelte/store"
	import { isValidImage, VALID_IMAGES_TYPES } from "../../utils/validation"

	function uploadAvatar(e: Event) {
		// @ts-ignore
		const selectedFile = (e.target as HTMLInputElement).files[0]

		if (!selectedFile || !isValidImage(selectedFile)) {
			// errorMessage = "Format de fichier invalide."
			return
		}

		$avtarUrl = selectedFile
		/*fetch(URL.createObjectURL(selectedFile))
            .then((res) => res.blob())
            .then((blob) => console.log(new Blob([blob])))*/
	}
</script>

<div class="an-file-input-image">
	<span class="sr-only">{srLabel}</span>

	<img src={URL.createObjectURL($avtarUrl)} alt="Ton avatar" />

	<input type="file" on:change={uploadAvatar} accept={VALID_IMAGES_TYPES} />

	<div class="indicator-item">
		<span class="material-symbols-rounded text-xl"> upload </span>
	</div>
</div>
