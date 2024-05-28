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
		<h3 class="label-text text-primary mb-2 text-xl">Text Field</h3>

		<textarea class="textarea textarea-bordered" value={field.content} on:input={updateContent}
		></textarea>
	</div>
{:else}
	<p class="mt-2 text-neutral">{field.content}</p>
{/if}
