import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Vercel adapter for deployment
		adapter: adapter(),
		files: {
			// Path to the service worker file
			serviceWorker: 'src/service-worker.ts'
		},
		alias: {
			$components: "src/lib/components",
			"$components/*": "src/lib/components/*",
			$primitives: "src/lib/primitives",
			"$primitives/*": "src/lib/primitives/*",
			$lib: "src/lib",
			"@": "src/lib",
			"@/*": "src/lib/*",
			$db: "src/db",
			$types: ".svelte-kit/types/src/routes/$types.d.ts",
		}
	}
};

export default config;