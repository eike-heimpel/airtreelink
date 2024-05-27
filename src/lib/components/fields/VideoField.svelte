<script lang="ts">
	import type { VideoField } from '$lib/types/fields';

	export let field: VideoField;
</script>

{#if field.url}
	<div class="mt-4">
		<iframe
			class="w-full aspect-video"
			src={field.url}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
			title="Video"
		></iframe>
	</div>
{/if}
