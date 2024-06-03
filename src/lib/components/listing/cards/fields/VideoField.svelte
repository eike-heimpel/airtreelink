<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { VideoField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';

	export let field: VideoField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		let url = event.target.value;

		function convertToEmbedUrl(url) {
			let videoId = null;

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
			return url;
		}

		url = convertToEmbedUrl(url);

		dispatch('updateField', { key: 'url', value: url });
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Video Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		<label class="label">
			<span class="label-text">Video URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateContent} />
	</div>
	<div slot="preview">
		{#if field.url}
			<iframe
				class="w-full aspect-video"
				src={field.url}
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
				title="Video"
			></iframe>
		{/if}
	</div>
</BaseField>
