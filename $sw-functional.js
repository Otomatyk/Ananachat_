// @ts-check

/// <reference lib="webworker" />
/// <reference types="@types/serviceworker" />

self.addEventListener("install", event => {
	console.log("Installed. From SW.")

	event.waitUntil(
		caches.open("assets").then(cache => {
			cache.addAll(["/src/App.svelte", "/src/lib/Main.svelte"])
		}),
	)
})

self.addEventListener("fetch", event => {
	if (event.request.url === "https://localhost:5173/") return

	console.debug(event)

	/**
	 * @type {string}
	 */
	const url = event.request?.url

	if (!url) {
		console.warn("lml")
		return
	}

	event.respondWith(
		event.waitUntil(async () => {
			console.log("987654321")

			const cachedResponse = await caches.match(event.request)

			let matchAny = false

			for (const selector of "js,svelte,ts".split(",")) {
				if (url.indexOf(`.${selector}`) && url.includes("/src/lib/")) {
					matchAny = true
					break
				}
			}

			console.log("12346879")

			if (!cachedResponse && matchAny) {
				;(await caches.open("pifpouf")).add(event.request)
			}

			if (cachedResponse) {
				console.warn(cachedResponse)
			}

			const val = cachedResponse || fetch(event.request)
			return val
		}),
	)

	console.debug(`URL requested: ${event.request.url}`)
})

self.addEventListener("sync", event => {
	if (event.tag === "my-tag") {
		console.log("Loggezd ! ")
	}
})

self.addEventListener("message", async event => {
	switch (event.data.action) {
		case "cache_profile":
			await addProfileToCache(event.data.profile)
	}
})

async function addProfileToCache(profile) {
	const cache = await caches.open("profile")
	cache.add(profile)

	console.log()
}

console.log("MMmiamamamou")
