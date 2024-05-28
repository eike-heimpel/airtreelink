<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { VideoField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';

	export let field: VideoField;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		let url = event.target.value;

		// Function to extract video ID and convert to embed URL
		function convertToEmbedUrl(url) {
			let videoId = null;

			// Extract video ID for various YouTube URL formats
			if (url.includes('youtu.be/')) {
				videoId = url.split('youtu.be/')[1];
			} else if (url.includes('youtube.com/watch?v=')) {
				videoId = url.split('youtube.com/watch?v=')[1];
				const ampersandPosition = videoId.indexOf('&');
				if (ampersandPosition !== -1) {
					videoId = videoId.substring(0, ampersandPosition);
				}
			} else if (url.includes('youtube.com/embed/')) {
				videoId = url.split('youtube.com/embed/')[1];
			} else if (url.includes('youtube.com/v/')) {
				videoId = url.split('youtube.com/v/')[1];
			} else {
				const videoIdMatch = url.match(/[?&]v=([^&]+)/);
				videoId = videoIdMatch ? videoIdMatch[1] : null;
			}

			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`;
			}
			return url; // Return the original URL if it doesn't match
		}

		url = convertToEmbedUrl(url);

		dispatch('updateField', { key: 'url', value: url });
	}
</script>

{#if $editMode}
	<div class="form-control p-4 bg-base-100">
		<h3 class="text-primary mb-2 text-xl cursor-auto">Video Field</h3>

		<label class="label">
			<span class="label-text">Video URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateContent} />
	</div>
{:else if field.url}
	<div class="p-4 bg-base-100 mt-4">
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
