<script lang="ts">
	import { onMount } from 'svelte';
	import { previewMode } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import type { ListingCard } from '$lib/types/cards';
	import { createEventDispatcher } from 'svelte';
	import { createEmptyField } from '$lib/types/fields';
	import type { FieldTypes } from '$lib/types/fields';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { flip } from 'svelte/animate';
	import { page } from '$app/stores';
	import type { ListingCardCreate } from '$lib/types/cards';

	import TextField from '$components/listing/cards/fields/TextField.svelte';
	import VideoField from '$components/listing/cards/fields/VideoField.svelte';
	import AddressField from '$components/listing/cards/fields/AddressField.svelte';
	import LinkField from '$components/listing/cards/fields/LinkField.svelte';
	import Title from '$components/listing/cards/Title.svelte';
	import ImageField from '$components/listing/cards/fields/ImageField.svelte';

	export let card: ListingCard | ListingCardCreate;

	export let cardEditMode = false;
	export let createNewCard = false;

	let editedCard: ListingCard = JSON.parse(JSON.stringify(card));
	let checked = false;
	let addingField = false;
	let showDeleteModal = false;
	let formLoading = false;
	let cardHasBeenEdited = false;
	let tempImages: { [key: number]: { url: string; file: File; altText: string } | null } = {};
	let supabase = $page.data.supabase;

	const dispatch = createEventDispatcher();

	$: cardHasBeenEdited = JSON.stringify(card) !== JSON.stringify(editedCard);

	function resetEditedCard(card: ListingCard) {
		editedCard = JSON.parse(JSON.stringify(card));
		tempImages = {};
	}

	$: resetEditedCard(card);

	function updateField(index: number, eventDetail) {
		editedCard.content_fields[index][eventDetail.key] = eventDetail.value;
	}

	function updateTempImage(
		index: number,
		tempImage: { url: string; file: File; altText: string } | null
	) {
		tempImages = { ...tempImages, [index]: tempImage };
	}

	function addField(type: FieldTypes) {
		const newField = createEmptyField(type);
		editedCard.content_fields.push(newField);
		editedCard = { ...editedCard };
		addingField = false;
	}

	async function saveEdit(
		loadingMessage = 'Updating card...',
		errorMessage = 'Error updating card.',
		successMessage = 'Card updated.'
	) {
		if (createNewCard) {
			dispatch('closeModal');
		}

		editedCard.last_changed = new Date().toISOString();

		// Upload new images to Supabase before saving the card
		for (const [index, tempImage] of Object.entries(tempImages)) {
			if (tempImage) {
				const { data, error } = await supabase.storage
					.from('listing_images')
					.upload(`${tempImage.file.name}`, tempImage.file);

				if (error) {
					console.error('Error uploading file:', error.message);
					toast.error(errorMessage);
					return;
				}
				const { data: image } = await supabase.storage
					.from('listing_images')
					.getPublicUrl(data.path);
				editedCard.content_fields[index].url = image.publicUrl;
				editedCard.content_fields[index].path = data.path;
				editedCard.content_fields[index].altText = tempImage.altText;
			}
		}

		const toastId = toast.loading(loadingMessage);

		const resp = await fetch('/api/listing/card', {
			method: createNewCard ? 'POST' : 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ cards: [editedCard] })
		});

		if (!resp.ok) {
			console.error(errorMessage, resp.statusText);
			toast.error(errorMessage, { id: toastId });
			return;
		}

		setTimeout(() => {
			toast.success(successMessage, { id: toastId });
		}, $toastPromiseDelayMs);

		dispatch('refreshSelectedCard', editedCard);
		invalidateAll();
	}

	async function deleteField(fieldId: string) {
		editedCard.content_fields = editedCard.content_fields.filter((f) => f.id !== fieldId);
	}

	function moveFieldUp(index: number) {
		if (index > 0) {
			const [movedItem] = editedCard.content_fields.splice(index, 1);
			editedCard.content_fields.splice(index - 1, 0, movedItem);
			editedCard = { ...editedCard };
		}
	}

	function moveFieldDown(index: number) {
		if (index < editedCard.content_fields.length - 1) {
			const [movedItem] = editedCard.content_fields.splice(index, 1);
			editedCard.content_fields.splice(index + 1, 0, movedItem);
			editedCard = { ...editedCard };
		}
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function toggleChecked() {
		checked = !checked;
	}

	function updateCard() {
		cardEditMode = !cardEditMode;

		if (!cardEditMode && cardHasBeenEdited) {
			saveEdit('Saving changes ...', 'Error saving changes.', 'Changes saved.');
		}
	}
</script>

<div class="modal-header">
	<div class="flex flex-row gap-4">
		<Title bind:title={editedCard.title} editMode={cardEditMode} bind:icon={editedCard.icon} />
	</div>
	<button
		class="btn btn-md btn-circle btn-ghost absolute right-0 top-0"
		on:click={() => dispatch('closeModal')}>X</button
	>
</div>
<div class="modal-body">
	{#if editedCard.content_fields}
		{#each editedCard.content_fields as field, index (field.id)}
			<div class="flex flex-col rounded-md" animate:flip={{ duration: 500 }}>
				{#if field.type === 'text'}
					<TextField
						{field}
						{index}
						totalFields={editedCard.content_fields.length}
						{cardEditMode}
						on:updateField={(e) => updateField(index, e.detail)}
						on:deleteField={() => deleteField(field.id)}
						on:moveFieldUp={() => moveFieldUp(index)}
						on:moveFieldDown={() => moveFieldDown(index)}
						on:save={() => saveEdit()}
						on:cancelEdit={() => resetEditedCard(card)}
					/>
				{:else if field.type === 'video'}
					<VideoField
						{field}
						{index}
						totalFields={editedCard.content_fields.length}
						{cardEditMode}
						on:updateField={(e) => updateField(index, e.detail)}
						on:deleteField={() => deleteField(field.id)}
						on:moveFieldUp={() => moveFieldUp(index)}
						on:moveFieldDown={() => moveFieldDown(index)}
					/>
				{:else if field.type === 'address'}
					<AddressField
						{field}
						{index}
						{cardEditMode}
						totalFields={editedCard.content_fields.length}
						on:updateField={(e) => updateField(index, e.detail)}
						on:deleteField={() => deleteField(field.id)}
						on:moveFieldUp={() => moveFieldUp(index)}
						on:moveFieldDown={() => moveFieldDown(index)}
					/>
				{:else if field.type === 'link'}
					<LinkField
						{field}
						{index}
						{cardEditMode}
						totalFields={editedCard.content_fields.length}
						on:updateField={(e) => updateField(index, e.detail)}
						on:deleteField={() => deleteField(field.id)}
						on:moveFieldUp={() => moveFieldUp(index)}
						on:moveFieldDown={() => moveFieldDown(index)}
					/>
				{:else if field.type === 'image'}
					<ImageField
						{field}
						{index}
						{cardEditMode}
						totalFields={editedCard.content_fields.length}
						tempImage={tempImages[index]}
						onTempImageUpdate={updateTempImage}
						on:updateField={(e) => updateField(index, e.detail)}
						on:deleteField={() => deleteField(field.id)}
						on:moveFieldUp={() => moveFieldUp(index)}
						on:moveFieldDown={() => moveFieldDown(index)}
					/>
				{:else}
					<p>Field type not recognized.</p>
				{/if}
			</div>
		{/each}
	{/if}
	{#if !$previewMode}
		<div class="flex flex-col gap-4">
			{#if addingField}
				<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					<button class="btn btn-outline" on:click={() => addField('text')}>Text</button>
					<button class="btn btn-outline" on:click={() => addField('address')}>Address</button>
					<button class="btn btn-outline" on:click={() => addField('video')}>Video</button>
					<button class="btn btn-outline" on:click={() => addField('image')}>Image</button>
				</div>
				<button
					class="btn btn-outline btn-primary w-full md:w-auto"
					on:click={() => (addingField = false)}
				>
					Cancel
				</button>
			{:else}
				<div class="flex flex-col gap-4 sm:flex-row sm:justify-between">
					<div class="flex flex-col gap-2 sm:flex-row sm:gap-2">
						<button
							class="btn {cardEditMode ? 'btn-outline' : 'btn-primary'} w-full sm:w-auto"
							on:click={() => {
								cardEditMode = !cardEditMode;
								resetEditedCard(card);
								if (createNewCard) {
									dispatch('closeModal');
								}
							}}
						>
							{cardEditMode ? 'Cancel Edit' : 'Edit Card'}
						</button>

						{#if cardEditMode}
							<button
								class="btn btn-outline w-full sm:w-auto"
								on:click={() => (addingField = true)}
							>
								Add Field
							</button>
						{/if}

						{#if cardHasBeenEdited && cardEditMode}
							<button class="btn btn-secondary w-full sm:w-auto" on:click={updateCard}>
								Save All Changes
							</button>
						{/if}
					</div>
					{#if !cardEditMode}
						<button class="btn btn-error btn-outline w-full sm:w-auto" on:click={openDeleteModal}>
							Delete Card
						</button>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>
{#if showDeleteModal}
	<dialog class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Delete</h3>
			<p class="py-4">Are you sure you want to delete your "{card.title}" card?</p>
			<div class="modal-action">
				<form
					method="POST"
					action="?/deleteCard"
					use:enhance={() => {
						formLoading = true;
						const toastId = toast.loading('Deleting card...');
						return async ({ update }) => {
							formLoading = false;
							setTimeout(() => {
								toast.success('Card deleted.', { id: toastId });
								dispatch('deleteCard', { id: card.id }); // Dispatch deleteCard event with card id
							}, $toastPromiseDelayMs);
							showDeleteModal = false;
							update();
						};
					}}
				>
					<input hidden name="cardId" value={card.id} />
					<button class="btn btn-error">Delete</button>
				</form>
				<button class="btn" on:click={() => (showDeleteModal = false)}>Cancel</button>
			</div>
		</div>
	</dialog>
{/if}
