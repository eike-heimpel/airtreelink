<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let index: number;
	export let totalFields: number;

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

<div class="flex gap-2">
	{#if index > 1}
		<button class="btn btn-outline btn-sm" on:click={moveFieldUp}>↑</button>
	{/if}
	<button class="btn btn-error btn-outline btn-sm" on:click={deleteField}>X</button>
	{#if index < totalFields - 1}
		<button class="btn btn-outline btn-sm" on:click={moveFieldDown}>↓</button>
	{/if}
</div>
