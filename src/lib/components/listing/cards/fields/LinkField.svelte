<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LinkField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';

	export let field: LinkField;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
	}

	function updateUrl(event) {
		dispatch('updateField', { key: 'url', value: event.target.value });
	}
</script>

{#if $editMode}
	<div class="form-control p-4 bg-base-100">
		<h3 class="text-primary mb-2 text-xl cursor-auto">Link Field</h3>

		<label class="label">
			<span class="label-text">Link Text</span>
		</label>
		<input type="text" class="input input-primary" value={field.content} on:input={updateContent} />
		<label class="label mt-4">
			<span class="label-text">Link URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateUrl} />
	</div>
{:else if field.url}
	<a class="link link-primary" href={field.url} target="_blank" rel="noopener noreferrer"
		>{field.content}</a
	>
{/if}
