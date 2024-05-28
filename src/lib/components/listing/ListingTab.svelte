<script lang="ts">
	import { onMount } from 'svelte';
	import { editMode } from '$lib/stores/store';
	import ListingCard from './ListingCard.svelte';
	import Sortable from 'sortablejs';
	import DragIcon from 'virtual:icons/mdi/drag';

	export let cards = [];
	export let type = '';

	let showAddModal = false;

	function openAddModal() {
		showAddModal = true;
	}

	function addCard() {
		showAddModal = false;
	}

	onMount(() => {
		if (editMode) {
			const sortable = new Sortable(document.getElementById('sortable-cards'), {
				animation: 150,
				onEnd: (event) => {
					const { oldIndex, newIndex } = event;
					if (oldIndex !== newIndex) {
						const movedItem = cards.splice(oldIndex, 1)[0];
						cards.splice(newIndex, 0, movedItem);
					}
				}
			});
		}
	});
</script>

<div class="container mx-auto">
	{#if editMode}
		<button class="btn btn-secondary mb-4 ml-2" on:click={openAddModal}>Add</button>
	{/if}

	<div id="sortable-cards" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:mt-10">
		{#each cards as card (card.id)}
			<div class="col-span-1 relative">
				<button
					tabindex="0"
					class="collapse collapse-arrow border border-base-300 bg-base-200 w-full"
				>
					<ListingCard {card} />
				</button>
			</div>
		{/each}
	</div>

	{#if showAddModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle"></dialog>
	{/if}
</div>
