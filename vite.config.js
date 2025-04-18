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
						"src": "/android-chrome-192x192.png",
						"sizes": "192x192",
						"type": "image/png"
					},
					{
						"src": "/android-chrome-512x512.png",
						"sizes": "512x512",
						"type": "image/png"
					},
					{
						"src": "/apple-touch-icon.png",
						"sizes": "180x180",
						"type": "image/png"
					},
					{
						"src": "/favicon-32x32.png",
						"sizes": "32x32",
						"type": "image/png"
					},
					{
						"src": "/favicon-16x16.png",
						"sizes": "16x16",
						"type": "image/png"
					},
					{
						"src": "/mstile-150x150.png",
						"sizes": "150x150",
						"type": "image/png"
					},
					{
						"src": "/safari-pinned-tab.svg",
						"sizes": "any",
						"type": "image/svg+xml",
						"purpose": "maskable"
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
