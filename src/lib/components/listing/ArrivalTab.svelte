<script lang="ts">
	import { previewMode } from '$lib/stores/store';
	import ListingCardComponent from '$components/listing/ListingCard.svelte';
	import { page } from '$app/stores';
	import type { ArrivalCard, ArrivalCardCreate } from '$lib/types/cards';
	import { ActiveTab } from '$lib/types/listing';
	import type { AddressField as AddressFieldType } from '$lib/types/fields';
	import type { TextField as TextFieldType, ContentField } from '$lib/types/fields';
	import ContentCopy from 'virtual:icons/mdi/content-copy';
	import { renderDeltaToHtml } from '$lib/utils/quill';
	import { sanitizeHtml } from '$lib/utils/helpers';
	import { browser } from '$app/environment';

	import { copyTextToClipboard } from '$lib/utils/helpers';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';

	export let cards: ArrivalCard[] = [];

	let tempCard: ArrivalCardCreate | null = null;
	let selectedCard: ArrivalCard | null = null;

	type ContentTitle = 'welcome_message' | 'contact_info' | 'checkin_time' | 'how_to_get_in';

	let renderedContents = {
		welcome_message: '',
		contact_info: '',
		checkin_time: '',
		how_to_get_in: ''
	};

	let contentLoaded = false;

	async function renderContent(field: ContentField, cardTitle: ContentTitle) {
		if (!field) return;
		if (field.type !== 'text') return;

		await tick();

		if (browser) {
			const html = await renderDeltaToHtml(field.delta, field.content);

			if (html) {
				renderedContents[cardTitle] = html;
			} else {
				renderedContents[cardTitle] = sanitizeHtml(field.content);
			}
		}
	}

	onMount(async () => {
		const renderPromises = cards.map((card) =>
			renderContent(card.content_fields[0], card.title as ContentTitle)
		);
		await Promise.all(renderPromises);
		contentLoaded = true;
	});

	function addAddress() {
		tempCard = {
			content_fields: [{ type: 'address', content: '' } as AddressFieldType],
			title: 'main_address',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: '',
			sort_order: 2
		};
	}

	function addWelcomeMessage() {
		tempCard = {
			content_fields: [{ type: 'text', content: '' } as TextFieldType],
			title: 'welcome_message',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: '',
			sort_order: 1
		};
	}

	function addContactInfo() {
		tempCard = {
			content_fields: [{ type: 'text', content: '' } as TextFieldType],
			title: 'contact_info',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: '',
			sort_order: 3
		};
	}

	function addCheckinTime() {
		tempCard = {
			content_fields: [{ type: 'text', content: '' } as TextFieldType],
			title: 'checkin_time',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: '',
			sort_order: 4
		};
	}

	function addHowToGetIn() {
		tempCard = {
			content_fields: [{ type: 'text', content: '' } as TextFieldType],
			title: 'how_to_get_in',
			listing_id: $page.data.currentListingInfo.id,
			icon: '',
			type: ActiveTab.Arrival,
			description: '',
			sort_order: 5
		};
	}

	function closeAddModal() {
		tempCard = null;
	}

	function closeCardModal() {
		selectedCard = null;
	}

	function refreshSelectedCard(e: CustomEvent<ArrivalCard>) {
		selectedCard = e.detail;
	}
	function openDirections(address: string) {
		const encodedAddress = encodeURIComponent(address);
		const googleMapsAppUrl = `comgooglemaps://?daddr=${encodedAddress}`;
		const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile) {
			window.open(googleMapsWebUrl, '_blank');
		} else {
			// Directly open the web URL on desktop browsers
			window.open(googleMapsWebUrl, '_blank');
		}
	}
</script>

{#if contentLoaded}
	<div class="container mx-auto" transition:fade={{ duration: 100 }}>
		<div
			class="grid grid-cols-1 gap-4 lg:gap-12 max-w-lg lg:max-w-2xl mx-auto items-center mt-4 md:mt-6 lg:mt-8 md:text-xl"
		>
			{#each cards as card (card.id)}
				{@const field = card.content_fields[0]}

				{#if card.title === 'welcome_message'}
					<div class="flex flex-col gap-2">
						<div class="flex justify-center items-center text-white">
							<p>
								{#if field.type === 'text'}
									{@html renderedContents[card.title]}
								{:else}{field.content}{/if}
							</p>
						</div>
						{#if !$previewMode}
							<button
								class="btn mt-2 btn-primary btn-outline w-fit mx-auto"
								on:click={() => {
									selectedCard = card;
								}}
							>
								Edit
							</button>
						{/if}
					</div>
				{/if}
				{#if card.title === 'main_address'}
					<div class="flex flex-col gap-2">
						<div class="divider divider-primary text-primary w-5/6 mx-auto">Address</div>

						<div class="flex justify-center items-center text-white">
							<p>{field.content}</p>

							<button
								class="flex items-center mt-2 cursor-pointer mb-2"
								on:click={() => copyTextToClipboard(field.content)}
							>
								<ContentCopy class="ml-2 w-5 h-5 text-primary" />
							</button>
						</div>
						<address class="ml-2 not-italic">
							<button
								class="btn btn-sm btn-accent btn-outline"
								on:click={() => openDirections(field.content)}
							>
								Get Directions
							</button>
						</address>
						{#if !$previewMode}
							<button
								class="btn mt-2 btn-primary btn-outline w-fit mx-auto"
								on:click={() => {
									selectedCard = card;
								}}
							>
								Edit
							</button>
						{/if}
					</div>
				{/if}

				{#if card.title === 'contact_info'}
					<div class="flex flex-col gap-2">
						<div class="divider divider-primary text-primary w-5/6 mx-auto">Contact Info</div>

						<div class="flex justify-center items-center text-white">
							<p>
								{#if field.type === 'text'}
									{@html renderedContents[card.title]}
								{:else}{field.content}{/if}
							</p>
						</div>
						{#if !$previewMode}
							<button
								class="btn mt-2 btn-primary btn-outline w-fit mx-auto"
								on:click={() => {
									selectedCard = card;
								}}
							>
								Edit
							</button>
						{/if}
					</div>
				{/if}
				{#if card.title === 'checkin_time'}
					<div class="flex flex-col gap-2">
						<div class="divider divider-primary text-primary w-5/6 mx-auto">Check-in Time</div>

						<div class="flex justify-center items-center text-white">
							<p>
								{#if field.type === 'text'}
									{@html renderedContents[card.title]}
								{:else}{field.content}{/if}
							</p>
						</div>
						{#if !$previewMode}
							<button
								class="btn mt-2 btn-primary btn-outline w-fit mx-auto"
								on:click={() => {
									selectedCard = card;
								}}
							>
								Edit
							</button>
						{/if}
					</div>
				{/if}
				{#if card.title === 'how_to_get_in'}
					<div class="flex flex-col gap-2">
						<div class="divider divider-primary text-primary w-5/6 mx-auto">How to Get In</div>
						<div class="flex justify-center items-center text-white">
							<p>
								{#if field.type === 'text'}
									{@html renderedContents[card.title]}
								{:else}{field.content}{/if}
							</p>
						</div>
						{#if !$previewMode}
							<button
								class="btn mt-2 btn-primary btn-outline w-fit mx-auto"
								on:click={() => {
									selectedCard = card;
								}}
							>
								Edit
							</button>
						{/if}
					</div>
				{/if}
			{/each}
			{#if !$previewMode}
				{#if !cards.some((card) => card.title === 'main_address')}
					<div class="col-span-1 relative">
						<div
							class="border-2 border-dashed rounded-2xl border-primary p-4 flex items-center justify-center h-full"
						>
							<button class="text-base-100 hover:text-primary" on:click={addAddress}>
								<span class="text-primary mr-4"> Add </span>Address
							</button>
						</div>
					</div>
				{/if}
				{#if !cards.some((card) => card.title === 'welcome_message')}
					<div class="col-span-1 relative">
						<div
							class="border-2 border-dashed rounded-2xl border-primary p-4 flex items-center justify-center h-full"
						>
							<button class="text-base-100 hover:text-primary" on:click={addWelcomeMessage}
								><span class="text-primary mr-4"> Add </span>Welcome Message</button
							>
						</div>
					</div>
				{/if}
				{#if !cards.some((card) => card.title === 'contact_info')}
					<div class="col-span-1 relative">
						<div
							class="border-2 border-dashed rounded-2xl border-primary p-4 flex items-center justify-center h-full"
						>
							<button class="text-base-100 hover:text-primary" on:click={addContactInfo}>
								<span class="text-primary mr-4"> Add </span>Contact Info</button
							>
						</div>
					</div>
				{/if}
				{#if !cards.some((card) => card.title === 'checkin_time')}
					<div class="col-span-1 relative">
						<div
							class="border-2 border-dashed rounded-2xl border-primary p-4 flex items-center justify-center h-full"
						>
							<button class="text-base-100 hover:text-primary" on:click={addCheckinTime}>
								<span class="text-primary mr-4"> Add </span>Check-in Time</button
							>
						</div>
					</div>
				{/if}
				{#if !cards.some((card) => card.title === 'how_to_get_in')}
					<div class="col-span-1 relative">
						<div
							class="border-2 border-dashed rounded-2xl border-primary p-4 flex items-center justify-center h-full"
						>
							<button class="text-base-100 hover:text-primary" on:click={addHowToGetIn}>
								<span class="text-primary mr-4"> Add </span>How to Get In</button
							>
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

		{#if selectedCard}
			<dialog
				class="modal modal-bottom sm:modal-middle"
				id="card-modal"
				class:modal-open={selectedCard}
			>
				<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
					<ListingCardComponent
						card={selectedCard}
						hideTitle={true}
						lockCards={true}
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
{/if}
