<script lang="ts">
	import type { ConversationSpecs } from "../services/conv/convTypes"

	export let conv: ConversationSpecs
</script>

<div class="flex h-fit w-full items-center">
	<img class="aspect-square size-14 rounded-full" alt="" src={conv.iconUrl} />
	<h5
		class="an-deemphasized-text ml-3 w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-lg">
		{conv.title}
	</h5>
</div>
