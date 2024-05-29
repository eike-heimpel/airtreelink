<script lang="ts">
	import { onMount } from 'svelte';
	import { editMode } from '$lib/stores/store';
	import ListingCardComponent from '$components/listing/ListingCard.svelte';
	import Sortable from 'sortablejs';
	import { page } from '$app/stores';
	import type { ListingCardCreate, ListingCard } from '$lib/types/cards';
	import TextField from '$components/listing/cards/fields/TextField.svelte';
	import LinkField from '$components/listing/cards/fields/LinkField.svelte';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';

	export let cards: ListingCard[] = [];
	export let type = '';

	let showAddModal = false;
	let newCardTitle = '';
	let moveCards = false;

	function openAddModal() {
		showAddModal = true;
	}

	function closeAddModal() {
		showAddModal = false;
		newCardTitle = '';
	}

	async function handleSave() {
		const toastId = toast.loading('Adding card...');

		const newCard: ListingCardCreate = {
			content_fields: [],
			description: '',
			listing_id: $page.data.currentListingInfo.id,
			title: newCardTitle,
			type: type
		};

		const response = await fetch('/api/listing/card', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ card: newCard })
		});

		if (response.ok) {
			const createdCard: ListingCard = await response.json();
			cards = [...cards, createdCard];
			setTimeout(() => {
				toast.success('Card created.', { id: toastId });
			}, $toastPromiseDelayMs);

			closeAddModal();
			invalidateAll();
		} else {
			toast.error('Failed to create new card.', { id: toastId });
			console.error('Failed to create new card');
		}
	}

	let sortable;
	onMount(() => {
		sortable = new Sortable(document.getElementById('sortable-cards'), {
			disabled: !$editMode && moveCards,
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

	function updateSortable(editMode: any, moveCards: any) {
		if (!sortable) return;

		if (!editMode || !moveCards) sortable.options.disabled = true;
		else sortable.options.disabled = false;
	}

	$: updateSortable($editMode, moveCards);
</script>

<div class="container mx-auto">
	{#if $editMode}
		<div class="flex justify-center gap-10">
			<button class="btn btn-primary mb-4 ml-2" on:click={openAddModal}>Add New Card</button>
			<button
				class="btn {moveCards ? 'btn-secondary' : 'btn-primary'} mb-4 ml-2"
				on:click={() => {
					moveCards = !moveCards;
				}}
			>
				{moveCards ? 'End Moving Cards' : 'Move Cards'}
			</button>
		</div>
	{/if}
	{#if moveCards}
		<p class="text-center text-lg italic text-accent">Drag and drop to reorder cards</p>
	{/if}

	<div id="sortable-cards" class="grid grid-cols-1 gap-4 md:gap-8 md:mt-10">
		{#each cards as card (card.id)}
			<div class="col-span-1 relative">
				<button
					tabindex="0"
					class="collapse collapse-arrow border border-base-300 bg-base-200 w-full"
				>
					<ListingCardComponent {card} {moveCards} />
				</button>
			</div>
		{/each}
	</div>

	{#if showAddModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Add New Card</h3>
				<div class="modal-content">
					<div class="form-control">
						<label class="label">Title</label>
						<input
							type="text"
							bind:value={newCardTitle}
							class="input input-bordered w-full"
							required
						/>
					</div>
				</div>
				<div class="modal-action">
					<button type="button" class="btn" on:click={closeAddModal}>Cancel</button>
					<button type="button" class="btn btn-primary" on:click={handleSave}>Add Card</button>
				</div>
			</div>
		</dialog>
	{/if}
</div>
