<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TextField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';

	export let field: TextField;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
	}
</script>

{#if $editMode}
	<div class="form-control p-4 bg-base-100">
		<h3 class="text-primary mb-2 text-xl cursor-auto">Text Field</h3>

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
