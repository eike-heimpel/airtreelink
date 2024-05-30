<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { VideoField } from '$lib/types/fields';
	import { editMode, previewMode } from '$lib/stores/store';
	import FieldControls from './FieldControls.svelte';
	import FieldEditControls from './FieldEditControls.svelte';

	export let field: VideoField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	$: if (cardEditMode) {
		individualEditMode = true;
	} else individualEditMode = false;

	const dispatch = createEventDispatcher();

	let individualEditMode = false;

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

	function deleteField() {
		dispatch('deleteField');
	}

	function moveFieldUp() {
		dispatch('moveFieldUp');
	}

	function moveFieldDown() {
		dispatch('moveFieldDown');
	}

	function save() {
		if (!cardEditMode) individualEditMode = false;

		dispatch('save');
	}

	function cancel() {
		if (!cardEditMode) individualEditMode = false;
		dispatch('cancelEdit');
	}

	$: if ($previewMode) individualEditMode = false;
</script>

{#if $editMode || individualEditMode}
	<div class="form-control p-4 bg-base-100">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-primary text-xl cursor-auto">Video Field</h3>
			<FieldControls
				{index}
				{totalFields}
				on:deleteField={deleteField}
				on:moveFieldUp={moveFieldUp}
				on:moveFieldDown={moveFieldDown}
			/>
		</div>
		<label class="label">
			<span class="label-text">Video URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateContent} />
		{#if !cardEditMode}
			<FieldEditControls editMode={$editMode} on:save={save} on:cancel={cancel} />
		{/if}
	</div>
{:else if field.url}
	<div class="relative">
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
