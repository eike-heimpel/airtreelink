<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { VideoField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';

	export let field: VideoField;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'url', value: event.target.value });
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
