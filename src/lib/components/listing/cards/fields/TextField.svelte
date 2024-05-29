<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TextField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';
	import FieldControls from './FieldControls.svelte';

	export let field: TextField;
	export let index: number;
	export let totalFields: number;

	const dispatch = createEventDispatcher();

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
</script>

{#if $editMode}
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
	</div>
{:else}
	<p class="mt-2 text-neutral">{field.content}</p>
{/if}
