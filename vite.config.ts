import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import mkcert from "vite-plugin-mkcert"

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8080,
	},

	plugins: [svelte(), mkcert()],
})
