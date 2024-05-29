<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let editMode: boolean;

	const dispatch = createEventDispatcher();
</script>

{#if !editMode}
	<div class="flex justify-center gap-4">
		<button
			class="btn btn-primary mt-2"
			on:click={() => {
				dispatch('save');
			}}>Save</button
		>
		<button
			class="btn btn-outline mt-2"
			on:click={() => {
				dispatch('cancel');
			}}>Cancel</button
		>
	</div>
{/if}
