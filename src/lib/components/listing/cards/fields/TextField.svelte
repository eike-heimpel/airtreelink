<script lang="ts">
	import BaseField from './BaseField.svelte';
	import FieldEditControls from './FieldEditControls.svelte';
	import type { TextField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';
	import { previewMode } from '$lib/stores/store';

	export let field: TextField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	let individualEditMode = false;

	$: if (cardEditMode) {
		individualEditMode = true;
	} else individualEditMode = false;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
	}

	function save() {
		if (!cardEditMode) individualEditMode = false;
		dispatch('save');
	}

	function cancel() {
		if (!cardEditMode) individualEditMode = false;
		dispatch('cancelEdit');
	}

	$: console.log(individualEditMode, cardEditMode);
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode || individualEditMode}
	title="Text Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		<textarea
			class="textarea textarea-primary h-40"
			value={field.content}
			on:input={updateContent}
			placeholder="Enter text here..."
		></textarea>
		{#if !cardEditMode && individualEditMode}
			<FieldEditControls editMode={cardEditMode} on:save={save} on:cancel={cancel} />
		{/if}
	</div>
	<div slot="preview">
		<p
			class="mt-2 text-neutral"
			on:dblclick={() => {
				if ($previewMode) return;
				individualEditMode = true;
			}}
		>
			{field.content}
		</p>
	</div>
</BaseField>
