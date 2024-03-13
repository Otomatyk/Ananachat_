<script lang="ts">
	import Lazy from "../../components/Lazy.svelte"

	import { authWithDiscord, socialProviders } from "./socialProviders"

	let menu: "choose-login-method" | "login-email" | "signup-email" =
		"choose-login-method"
</script>

<div class="absolute left-0 top-0 size-full bg-primary/30" />

<svg
	id="svg"
	viewBox="0 0 1440 690"
	xmlns="http://www.w3.org/2000/svg"
	class="an-static-color absolute bottom-0 left-0 h-fit"
	><path
		d="M 0,700 L 0,105 C 100.83846153846156,124.1025641025641 201.67692307692312,143.2051282051282 270,154 C 338.3230769230769,164.7948717948718 374.13076923076915,167.2820512820513 450,152 C 525.8692307692309,136.7179487179487 641.8000000000001,103.66666666666666 735,99 C 828.1999999999999,94.33333333333334 898.6692307692309,118.05128205128206 961,111 C 1023.3307692307691,103.94871794871794 1077.5230769230768,66.12820512820512 1156,60 C 1234.4769230769232,53.871794871794876 1337.2384615384617,79.43589743589743 1440,105 L 1440,700 L 0,700 Z"
		stroke="none"
		stroke-width="0"
		fill="#e74009"
		fill-opacity="0.265"
		class="path-0 transition-all delay-150 duration-300 ease-in-out"
		data-darkreader-inline-stroke=""
		style="--darkreader-inline-stroke: none; --darkreader-inline-fill: #ff4d0b;"
		data-darkreader-inline-fill=""></path
	><path
		d="M 0,700 L 0,245 C 76.85897435897436,240.85641025641027 153.71794871794873,236.71282051282054 231,240 C 308.28205128205127,243.28717948717946 385.98717948717945,254.0051282051282 465,257 C 544.0128205128206,259.9948717948718 624.3333333333334,255.26666666666665 717,259 C 809.6666666666666,262.73333333333335 914.6794871794871,274.92820512820515 989,267 C 1063.320512820513,259.07179487179485 1106.948717948718,231.0205128205128 1177,224 C 1247.051282051282,216.9794871794872 1343.525641025641,230.9897435897436 1440,245 L 1440,700 L 0,700 Z"
		stroke="none"
		stroke-width="0"
		fill="#e74009"
		fill-opacity="0.4"
		class="path-1 transition-all delay-150 duration-300 ease-in-out"
		data-darkreader-inline-stroke=""
		style="--darkreader-inline-stroke: none; --darkreader-inline-fill: #ff4d0b;"
		data-darkreader-inline-fill=""></path
	><path
		d="M 0,700 L 0,385 C 86.87435897435898,385.34871794871793 173.74871794871797,385.69743589743587 251,393 C 328.25128205128203,400.30256410256413 395.8794871794872,414.55897435897435 461,398 C 526.1205128205128,381.44102564102565 588.7333333333332,334.06666666666666 677,335 C 765.2666666666668,335.93333333333334 879.1871794871797,385.174358974359 962,396 C 1044.8128205128203,406.825641025641 1096.5179487179487,379.2358974358974 1171,371 C 1245.4820512820513,362.7641025641026 1342.7410256410258,373.8820512820513 1440,385 L 1440,700 L 0,700 Z"
		stroke="none"
		stroke-width="0"
		fill="#e74009"
		fill-opacity="0.53"
		class="path-2 transition-all delay-150 duration-300 ease-in-out"
		data-darkreader-inline-fill=""
		data-darkreader-inline-stroke=""
		style="--darkreader-inline-fill: #ff4d0b; --darkreader-inline-stroke: none;"
	></path
	><path
		d="M 0,700 L 0,525 C 86.27435897435899,509.9589743589744 172.54871794871798,494.9179487179488 252,504 C 331.451282051282,513.0820512820512 404.07948717948716,546.2871794871795 470,559 C 535.9205128205128,571.7128205128205 595.1333333333334,563.9333333333334 687,560 C 778.8666666666666,556.0666666666666 903.3871794871793,555.9794871794871 995,542 C 1086.6128205128207,528.0205128205129 1145.3179487179486,500.148717948718 1214,495 C 1282.6820512820514,489.851282051282 1361.3410256410257,507.42564102564097 1440,525 L 1440,700 L 0,700 Z"
		stroke="none"
		stroke-width="0"
		fill="#e74009"
		fill-opacity="1"
		class="path-3 transition-all delay-150 duration-300 ease-in-out"
		data-darkreader-inline-fill=""
		data-darkreader-inline-stroke=""
		style="--darkreader-inline-fill: #ff4d0b; --darkreader-inline-stroke: none;"
	></path
	></svg>

<div
	class="relative z-10 flex h-full flex-col flex-wrap content-center overflow-y-auto max-md:bg-base-200">
	<div
		class="an-outset-box-lg relative flex h-full w-full flex-col items-center gap-8 bg-base-200 px-8 py-4 md:h-auto md:w-screen md:max-w-128 md:translate-y-20 md:rounded-box md:px-12 md:py-8">
		<h1 class="text-3xl">
			{menu === "choose-login-method" || menu === "login-email"
				? "Se connecter"
				: "S'inscrire"}
		</h1>

		{#if menu !== "choose-login-method" && menu !== "signup-email"}
			<button
				class="absolute left-4 top-4 inline-flex items-center gap-2 text-primary"
				on:click={() => (menu = "choose-login-method")}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 320 512"
					class="an-static-color size-3 fill-primary"
					><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
						d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" /></svg>
				Retour
			</button>
		{/if}

		<div class="flex w-full flex-grow flex-col items-center">
			{#if menu === "login-email"}
				<Lazy component={import("./LoginForm.svelte")} />
			{:else if menu === "signup-email"}
				<Lazy component={import("./SignupForm.svelte")} />
			{/if}

			{#if menu === "choose-login-method"}
				<div class="grid w-full max-w-96 grid-cols-1 gap-5 text-lg">
					<button
						class="btn btn-primary"
						on:click={() => (menu = "login-email")}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							class="an-static-color aspect-square size-6 fill-white"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>

						Continuer avec ton e-mail
					</button>

					{#if $socialProviders.includes("discord")}
						<button
							class="btn text-white [--btn-color:var(--discord)]"
							on:click={authWithDiscord}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 640 512"
								class="an-static-color aspect-square size-6 fill-white"
								><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
									d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" /></svg>

							Continuer avec Discord
						</button>
					{/if}

					<button
						class="btn text-white [--btn-color:var(--instagram)]"
						on:click={authWithDiscord}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							class="an-static-color aspect-square size-6 fill-white"
							><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
								d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>

						Continuer avec Instagram
					</button>
				</div>
			{/if}
		</div>

		<div class="flex items-baseline gap-[1ch] empty:hidden">
			{#if menu === "choose-login-method"}
				<p class="an-deemphasized-text">Pas encore de compte ?</p>

				<button
					class="an-tertiary-btn font-semibold text-primary"
					on:click={() => (menu = "signup-email")}>
					S'inscrire
				</button>
			{:else if menu === "signup-email"}
				<p class="an-deemphasized-text">Déjà inscrit(e) ?</p>

				<button
					class="an-tertiary-btn font-semibold text-primary"
					on:click={() => (menu = "choose-login-method")}>
					Se connecter
				</button>
			{/if}
		</div>
	</div>
</div>
