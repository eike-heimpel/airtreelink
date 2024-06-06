<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { VideoField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';

	export let field: VideoField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;
	export let lock = false;

	const dispatch = createEventDispatcher();
	let consentGiven = false;
	let isYouTubeUrl = true;

	function updateContent(event) {
		let url = event.target.value;

		function isValidYouTubeUrl(url) {
			const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
			return youtubeRegex.test(url);
		}

		function convertToNoCookieEmbedUrl(url) {
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
				return `https://www.youtube-nocookie.com/embed/${videoId}`;
			}
			return url;
		}

		if (isValidYouTubeUrl(url)) {
			url = convertToNoCookieEmbedUrl(url);
			isYouTubeUrl = true;
			dispatch('updateField', { key: 'url', value: url });
		} else {
			isYouTubeUrl = false;
		}
	}

	function giveConsent() {
		consentGiven = true;
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Video Field"
	{lock}
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		<label class="label">
			<span class="label-text">Video URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateContent} />
		{#if !isYouTubeUrl}
			<p class="text-red-500 mt-2">
				Only YouTube videos are supported. Please enter a valid YouTube URL.
			</p>
		{/if}
	</div>
	<div slot="preview" class="relative">
		{#if field.url && isYouTubeUrl}
			<div class="relative w-full aspect-video">
				<iframe
					class="w-full h-full"
					src={field.url}
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					title="Video"
				></iframe>
				{#if !consentGiven}
					<div
						class="absolute inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center text-center text-white p-4"
					>
						<p>
							YouTube places tracking technologies when watching their videos. This is beyond our
							control. By clicking 'Yes', you consent to the use of these tracking technologies by
							YouTube.
						</p>
						<button class="btn btn-primary mt-4" on:click={giveConsent}>Yes</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</BaseField>
