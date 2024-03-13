const theme = localStorage.getItem("theme")

if (theme) document.body.setAttribute("data-theme", theme)

import "./app.css"

/*export let sw: ServiceWorkerRegistration;

async function loadServiceWorker() {
    if ("serviceWorker" in navigator) {
        try {
             const registration = await navigator.serviceWorker.register("../$sw-functional.js", {
                scope: "/",
            });

            sw = registration
            
            if (registration.installing) {
                console.log("Service worker installing...");
                
            } else if (registration.waiting) {
                console.log("Service worker installed");
                
            } else if (registration.active) {
                console.log("Service worker active");
            }
            
            registration.active?.postMessage({
                "action": "add"
            });
            
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
}

loadServiceWorker()*/

import App from "./App.svelte"

const app = new App({
	// @ts-ignore
	target: document.getElementById("app"),
})

export default app
