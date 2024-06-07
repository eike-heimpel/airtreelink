<script lang="ts">
	import { onMount } from 'svelte';
	import { previewMode } from '$lib/stores/store';
	import ListingCardComponent from '$components/listing/ListingCard.svelte';
	import Sortable from 'sortablejs';
	import { page } from '$app/stores';
	import type { ListingCardCreate, ListingCard } from '$lib/types/cards';
	import { fade } from 'svelte/transition';
	import { getTemplate } from '$lib/listings/cards/cardTemplates';
	import Title from './cards/Title.svelte';
	import { iconMapping } from '$lib/listings/cards/cardIconMappings';
	import SearchFilter from '$components/SearchFilter.svelte';
	import { ActiveTab } from '$lib/types/listing';

	export let cards: ListingCard[] = [];
	export let type: string;

	let tempCard: ListingCardCreate | null = null;
	let moveCards = false;
	let selectedCard: ListingCard | null = null;
	let filteredCards: ListingCard[] = cards;

	$: filteredCards = cards;

	function openAddModal() {
		createTempCard();
	}

	function closeAddModal() {
		tempCard = null;
	}

	function createTempCard() {
		const template = getTemplate(type);
		tempCard = {
			...template,
			title: '',
			listing_id: $page.data.currentListingInfo.id,
			icon: ''
		};
	}

	let sortable;
	onMount(() => {
		sortable = new Sortable(document.getElementById('sortable-cards'), {
			disabled: !moveCards,
			animation: 150,
			onEnd: (event) => {
				const { oldIndex, newIndex } = event;
				if (oldIndex !== newIndex) {
					const movedItem = filteredCards.splice(oldIndex, 1)[0];
					filteredCards.splice(newIndex, 0, movedItem);
				}
			}
		});
	});

	function updateSortable(moveCards: any) {
		if (!sortable) return;

		if (!moveCards) sortable.options.disabled = true;
		else sortable.options.disabled = false;
	}

	$: updateSortable(moveCards);

	function openCardModal(card: ListingCard) {
		selectedCard = card;
	}

	function closeCardModal() {
		selectedCard = null;
	}

	function refreshSelectedCard(e) {
		selectedCard = e.detail;
	}

	function handleFilter(event) {
		filteredCards = event.detail.filteredCards;
	}

	async function saveCardOrder() {
		const updatedOrder = filteredCards.map((card, index) => ({
			id: card.id,
			sort_order: cards[index].sort_order // Preserve the original sort_order values
		}));

		try {
			const response = await fetch('/api/listing/card', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ cards: updatedOrder })
			});

			if (!response.ok) {
				throw new Error('Failed to save card order');
			}
		} catch (error) {
			console.error('Error saving card order:', error);
		}
	}

	function toggleMoveCards() {
		moveCards = !moveCards;
		if (!moveCards) {
			saveCardOrder();
		}
	}

	$: if (moveCards) {
	}
</script>

<div class="container mx-auto">
	<div
		class="max-w-2xl mx-auto mb-4 lg:mb-8"
		class:hidden={!$previewMode || type === ActiveTab.Arrival}
	>
		<SearchFilter
			{cards}
			addIconFilter={type === ActiveTab.Recommendation}
			on:filter={handleFilter}
		/>
	</div>

	{#if !$previewMode}
		<div class="flex justify-center gap-10 mb-4">
			<button class="btn btn-primary ml-2" on:click={openAddModal}>Add New Card</button>
			<button
				class="btn {moveCards ? 'btn-secondary' : 'btn-primary'} ml-2"
				on:click={toggleMoveCards}
			>
				{moveCards ? 'Lock Cards' : 'Reorder Cards'}
			</button>
		</div>
	{/if}
	{#if moveCards}
		<p class="text-center text-lg italic text-accent mb-2" in:fade>
			Drag and drop to reorder cards
		</p>
	{/if}

	<div
		id="sortable-cards"
		class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 max-w-lg lg:max-w-2xl mx-auto items-center"
	>
		{#each filteredCards as card (card.id)}
			<div class="col-span-1 relative">
				<button
					tabindex="0"
					class="collapse collapse-arrow border border-base-300 bg-base-200 w-full {$previewMode
						? 'bg-opacity-50'
						: ''}"
					on:click={() => openCardModal(card)}
				>
					<div class="card-body flex-row justify-between p-4">
						<Title bind:title={card.title} editMode={false} bind:icon={card.icon} />
					</div>
				</button>
			</div>
		{/each}
	</div>

	{#if tempCard}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
				<ListingCardComponent
					card={tempCard}
					cardEditMode={true}
					createNewCard={true}
					on:closeModal={closeAddModal}
				/>
			</div>
		</dialog>
	{/if}

	{#if selectedCard}
		<dialog
			class="modal modal-bottom sm:modal-middle"
			id="card-modal"
			class:modal-open={selectedCard}
		>
			<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
				<ListingCardComponent
					card={selectedCard}
					on:closeModal={closeCardModal}
					on:refreshSelectedCard={refreshSelectedCard}
					on:deleteCard={() => {
						selectedCard = null;
					}}
				/>
			</div>
			<form method="dialog" class="modal-backdrop">
				<button on:click={closeCardModal}>close</button>
			</form>
		</dialog>
	{/if}
</div>
