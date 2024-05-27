<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { editMode } from '$lib/stores/store';
	import ListingCard from './ListingCard.svelte';

	export let cards = [];
	export let type = '';

	let showAddModal = false;

	function openAddModal() {
		showAddModal = true;
	}

	function addCard() {
		showAddModal = false;
	}

	function handleDndConsider(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		cards = newItems;
	}

	function handleDndFinalize(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		cards = newItems;
	}
</script>

<div class="container mx-auto px-4">
	{#if $editMode}
		<button class="btn btn-secondary mb-4 ml-2" on:click={openAddModal}>Add</button>
	{/if}

	<div
		class="grid grid-cols-1 md:grid-cols-2 gap-4"
		use:dndzone={{
			items: cards,
			flipDurationMs: 200,
			dropTargetStyle: {},
			dragDisabled: !$editMode
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#if type === 'recommendations'}
			{#each cards as card (card.id)}
				<div class="card bg-base-100 bg-opacity-75 shadow-2xl m-2" animate:flip={{ duration: 200 }}>
					<ListingCard {card} />
				</div>
			{/each}
		{:else if type === 'infos'}
			{#each cards as card (card.id)}
				<div class="card bg-base-100 bg-opacity-75 shadow-2xl m-2" animate:flip={{ duration: 200 }}>
					<ListingCard {card} />
				</div>
			{/each}
		{:else if type === 'home'}
			{#each cards as card (card.id)}
				<div class="card bg-base-100 bg-opacity-75 shadow-2xl m-2" animate:flip={{ duration: 200 }}>
					<ListingCard {card} />
				</div>
			{/each}
		{/if}
	</div>

	{#if showAddModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle"></dialog>
	{/if}
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
