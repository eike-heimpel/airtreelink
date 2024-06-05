<script lang="ts">
	import { previewMode } from '$lib/stores/store';
	import ListingCardComponent from '$components/listing/ListingCard.svelte';
	import { page } from '$app/stores';
	import type { ListingCardCreate, ListingCard } from '$lib/types/cards';
	import { ActiveTab } from '$lib/types/listing';
	import type { AddressField as AddressFieldType } from '$lib/types/fields';
	import ContentCopy from 'virtual:icons/mdi/content-copy';

	import { copyTextToClipboard } from '$lib/utils/helpers';

	export let cards: ListingCard[] = [];

	let tempCard: ListingCardCreate | null = null;
	let selectedCard: ListingCard | null = null;
	let filteredCards: ListingCard[] = cards;
	let addressField: AddressFieldType;

	$: filteredCards = cards;

	function addAddress() {
		// addressField = createEmptyField('address') as AddressFieldType;
		// console.log(addressField);
		tempCard = {
			content_fields: [{ type: 'address', content: '' } as AddressFieldType],
			title: 'main_address',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: ''
		};
	}

	function closeAddModal() {
		tempCard = null;
	}

	function openCardModal(card: ListingCard) {
		selectedCard = card;
	}

	function closeCardModal() {
		selectedCard = null;
	}

	function refreshSelectedCard(e) {
		selectedCard = e.detail;
	}
</script>

<!-- {#if addressField}
	<dialog class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
			<ListingCardComponent
				card={tempCard}
				hideTitle={true}
				on:closeModal={closeCardModal}
				on:refreshSelectedCard={refreshSelectedCard}
				on:deleteCard={() => {
					selectedCard = null;
				}}
			/>
		</div>
	</dialog>
{/if} -->

<div class="container mx-auto">
	<div class="grid grid-cols-1 gap-4 lg:gap-8 max-w-2xl lg:max-w-4xl mx-auto items-center">
		{#each cards as card (card.id)}
			{@const field = card.content_fields[0]}
			{#if card.title === 'main_address'}
				<div class="flex justify-center items-center text-white">
					<p>{field.content}</p>

					<button
						class="flex items-center mt-2 cursor-pointer mb-2"
						on:click={() => copyTextToClipboard(field.content)}
					>
						<ContentCopy class="ml-2 w-5 h-5 text-primary" />
					</button>
				</div>
			{/if}
		{/each}
		{#if !$previewMode}
			{#if !cards.some((card) => card.title === 'main_address')}
				<div class="col-span-1 relative">
					<div
						class="border-2 border-dashed rounded-2xl border-base-100 p-4 flex items-center justify-center h-full"
					>
						<button class="text-base-100 hover:text-primary" on:click={addAddress}>
							Add your Address
						</button>
					</div>
				</div>
			{/if}
			{#if !cards.some((card) => card.title === 'welcome_message')}
				<div class="col-span-1 relative">
					<div
						class="border-2 border-dashed rounded-2xl border-base-100 p-4 flex items-center justify-center h-full"
					>
						<button class="text-base-100 hover:text-primary"> Add your Welcome Message </button>
					</div>
				</div>
			{/if}
			{#if !cards.some((card) => card.title === 'contact_info')}
				<div class="col-span-1 relative">
					<div
						class="border-2 border-dashed rounded-2xl border-base-100 p-4 flex items-center justify-center h-full"
					>
						<button class="text-base-100 hover:text-primary"> Add your Contact Info </button>
					</div>
				</div>
			{/if}
			{#if !cards.some((card) => card.title === 'checkin_time')}
				<div class="col-span-1 relative">
					<div
						class="border-2 border-dashed rounded-2xl border-base-100 p-4 flex items-center justify-center h-full"
					>
						<button class="text-base-100 hover:text-primary"> Add your Check-in Time </button>
					</div>
				</div>
			{/if}
			{#if !cards.some((card) => card.title === 'how_to_get_in')}
				<div class="col-span-1 relative">
					<div
						class="border-2 border-dashed rounded-2xl border-base-100 p-4 flex items-center justify-center h-full"
					>
						<button class="text-base-100 hover:text-primary"> Add your How to Get In </button>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	{#if tempCard}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
				<ListingCardComponent
					card={tempCard}
					cardEditMode={true}
					createNewCard={true}
					hideTitle={true}
					lockCards={true}
					on:closeModal={closeAddModal}
				/>
			</div>
		</dialog>
	{/if}
</div>
