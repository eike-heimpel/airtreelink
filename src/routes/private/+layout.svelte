<script>
	import { previewMode } from '$lib/stores/store';
	import { inject } from '@vercel/analytics';

	$previewMode = false;
</script>

<main>
	<slot />
</main>
