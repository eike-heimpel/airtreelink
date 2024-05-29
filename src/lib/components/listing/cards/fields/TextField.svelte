<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TextField } from '$lib/types/fields';
	import { editMode, previewMode } from '$lib/stores/store';
	import FieldControls from './FieldControls.svelte';
	import FieldEditControls from './FieldEditControls.svelte';

	export let field: TextField;
	export let index: number;
	export let totalFields: number;

	const dispatch = createEventDispatcher();

	let individualEditMode = false;

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
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
		individualEditMode = false;
		dispatch('save');
	}

	function cancel() {
		individualEditMode = false;

		dispatch('cancelEdit');
	}
</script>

{#if $editMode || individualEditMode}
	<div class="form-control p-4 bg-base-100">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-primary text-xl cursor-auto">Text Field</h3>
			<FieldControls
				{index}
				{totalFields}
				on:deleteField={deleteField}
				on:moveFieldUp={moveFieldUp}
				on:moveFieldDown={moveFieldDown}
			/>
		</div>
		<textarea
			class="textarea textarea-primary h-40"
			value={field.content}
			on:input={updateContent}
			placeholder="Enter text here..."
		></textarea>

		<FieldEditControls editMode={$editMode} on:save={save} on:cancel={cancel} />
	</div>
{:else}
	<div class="relative">
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
{/if}
