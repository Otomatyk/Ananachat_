<script lang="ts">
	export let onclose: () => any
	export let userId: Relation

	import Popup from "../../components/Popup.svelte"

	import { type Relation } from "../../types/records"
	import { pb } from "../typescript/pb"
	import { userProfileCache } from "../typescript/caches"
	import { convertPbDatetime } from "../../utils/dates"
</script>

<Popup shadow={false} onclose={() => onclose()} size="sm">
	{#await userProfileCache.get(userId) then profile}
		<div class="mb-4 flex items-center gap-5">
			<img
				class="avatar size-20"
				src={pb.files.getUrl(profile, profile.avatar)}
				alt="Photo de profil de {profile.displayname}" />

			<div class="flex flex-col gap-1">
				<h2 class="text-3xl">{profile.displayname}</h2>
				<h3 class="an-deemphasized-text text-xl">{profile.username}</h3>
			</div>
		</div>

		<section class="an-outset-box-md my-4 rounded-box bg-base-200 p-2">
			<h5 class="mb-1 text-lg font-medium uppercase">à propos de moi</h5>

			<p class="left-rail an-deemphasized-text">
				{profile.description ||
					"Cet utilisateur n'as pas de description"}
			</p>

			<small class="an-deemphasized-text mt-6 block">
				Membre d'Ananachat depuis le <time datetime={profile.created}
					>{convertPbDatetime(profile.created)}</time>
			</small>
		</section>
	{/await}
</Popup>
