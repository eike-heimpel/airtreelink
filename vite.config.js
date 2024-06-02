import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import { SvelteKitPWA } from '@vite-pwa/sveltekit'


export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				"name": "GuestLink",
				"short_name": "GuestLink",
				"start_url": "./",
				"display": "standalone",
				"background_color": "#f2f2f2",
				"lang": "en",
				"scope": "./",
				"description": "GuestLink empowers short-term rental hosts to share all essential information with their guests via a unique URL. This ensures a smooth, convenient, and personalized guest experience.",
				"theme_color": "#65c3c8",
				"icons": [
					{
						"src": "/favicon.png",
						"sizes": "192x192",
						"type": "image/png"
					}
				]
			}
		}
		),
		Icons({
			compiler: 'svelte',
		}),
	],
})
