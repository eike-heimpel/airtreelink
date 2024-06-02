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

	export let cards: ListingCard[] = [];
	export let type: string;

	let newCardTitle = '';
	let tempCard: ListingCardCreate | null = null;
	let moveCards = false;
	let selectedCard: ListingCard | null = null;
	let selectedIcon: string | null = null;
	let filterDropdownOpen = false;
	let iconsLoaded = false;

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

	function refreshSelectedCard(e) {
		selectedCard = e.detail;
	}

	function filterByIcon(iconKey: string) {
		console.log('filter by icon', iconKey);
		filterDropdownOpen = false;
		selectedIcon = iconKey;
	}
</script>

<div class="container mx-auto">
	<details class="dropdown" bind:open={filterDropdownOpen}>
		<summary class="m-1 btn">Click</summary>
		{#if filterDropdownOpen}
			<ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
				{#each Object.entries(iconMapping) as [key, icon]}
					<li>
						<button
							on:click={() => {
								filterByIcon(key);
							}}
							class="flex items-center gap-2"
						>
							<svelte:component this={iconMapping[key].component} class="w-5 h-5" />

							<span>{icon.name}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</details>

	{#if !$previewMode}
		<div class="flex justify-center gap-10 mb-4">
			<button class="btn btn-primary ml-2" on:click={openAddModal}>Add New Card</button>
			<button
				class="btn {moveCards ? 'btn-secondary' : 'btn-primary'} ml-2"
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

	<div id="sortable-cards" class="grid grid-cols-1 gap-4 max-w-2xl mx-auto items-center">
		{#each cards.filter((card) => !selectedIcon || card.icon === selectedIcon) as card (card.id)}
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
				/>
			</div>
			<form method="dialog" class="modal-backdrop" on:click={closeCardModal}>
				<button>close</button>
			</form>
		</dialog>
	{/if}
</div>
