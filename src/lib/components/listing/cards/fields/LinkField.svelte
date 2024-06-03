<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { LinkField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';

	export let field: LinkField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
	}

	function updateUrl(event) {
		dispatch('updateField', { key: 'url', value: event.target.value });
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Link Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		<label class="label">
			<span class="label-text">Link Text</span>
		</label>
		<input type="text" class="input input-primary" value={field.content} on:input={updateContent} />
		<label class="label mt-4">
			<span class="label-text">Link URL</span>
		</label>
		<input type="text" class="input input-primary" value={field.url} on:input={updateUrl} />
	</div>
	<div slot="preview">
		{#if field.url}
			<a class="link" href={field.url} target="_blank" rel="noopener noreferrer">{field.content}</a>
		{/if}
	</div>
</BaseField>
