<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { previewMode } from '$lib/stores/store';
	import FieldControls from './FieldControls.svelte';

	export let field: any;
	export let index: number;
	export let totalFields: number;
	export let editMode: boolean;
	export let title: string;
	export let lock = false;

	const dispatch = createEventDispatcher();

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

{#if editMode && !$previewMode}
	<div class="form-control p-4 bg-base-100">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-primary text-xl cursor-auto">{title}</h3>
			{#if !lock}
				<FieldControls
					{index}
					{totalFields}
					on:deleteField={deleteField}
					on:moveFieldUp={moveFieldUp}
					on:moveFieldDown={moveFieldDown}
				/>
			{/if}
		</div>
		<slot name="content"></slot>
	</div>
{:else}
	<div class="relative text-left p-4">
		<slot name="preview"></slot>
	</div>
{/if}
