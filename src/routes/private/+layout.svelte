<script>
	import { previewMode } from '$lib/stores/store';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';

	inject({ mode: dev ? 'development' : 'production' });

	$previewMode = false;
</script>

<main>
	<slot />
</main>
