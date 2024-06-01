<script lang="ts">
	import { onMount } from 'svelte';
	import { editMode, previewMode } from '$lib/stores/store';
	import ListingCardComponent from '$components/listing/ListingCard.svelte';
	import Sortable from 'sortablejs';
	import { page } from '$app/stores';
	import type { ListingCardCreate, ListingCard } from '$lib/types/cards';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';
	import { fade } from 'svelte/transition';
	import { getTemplate } from '$lib/listings/cards/cardTemplates';
	import Title from './cards/Title.svelte';

	export let cards: ListingCard[] = [];
	export let type: string;

	let newCardTitle = '';
	let tempCard: ListingCardCreate | null = null;
	let moveCards = false;
	let selectedCard: ListingCard | null = null;

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
			title: newCardTitle,
			listing_id: $page.data.currentListingInfo.id
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
					const movedItem = cards.splice(oldIndex, 1)[0];
					cards.splice(newIndex, 0, movedItem);
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

	const handleOutsideClick = (event) => {
		closeCardModal();
	};
</script>

<div class="container mx-auto">
	{#if !$previewMode}
		<div class="flex justify-center gap-10">
			<button class="btn btn-primary mb-4 ml-2" on:click={openAddModal}>Add New Card</button>
			<button
				class="btn {moveCards ? 'btn-secondary' : 'btn-primary'} mb-4 ml-2"
				on:click={() => {
					moveCards = !moveCards;
				}}
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

	<div id="sortable-cards" class="grid grid-cols-1 gap-4 m max-w-2xl mx-auto">
		{#each cards as card (card.id)}
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
				<ListingCardComponent card={selectedCard} on:closeModal={closeCardModal} />
			</div>
			<form method="dialog" class="modal-backdrop" on:click={closeCardModal}>
				<button>close</button>
			</form>
		</dialog>
	{/if}
</div>
