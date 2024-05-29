<script lang="ts">
	import { onMount } from 'svelte';
	import { editMode } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import type { ListingCard } from '$lib/types/cards';
	import { createEventDispatcher } from 'svelte';
	import { createEmptyField } from '$lib/types/fields';
	import type { FieldTypes } from '$lib/types/fields';
	import { fade } from 'svelte/transition';
	import { enhance } from '$app/forms';

	import TextFieldComponent from '$components/listing/cards/fields/TextField.svelte';
	import VideoFieldComponent from '$components/listing/cards/fields/VideoField.svelte';
	import AddressFieldComponent from '$components/listing/cards/fields/AddressField.svelte';
	import LinkFieldComponent from '$components/listing/cards/fields/LinkField.svelte';
	import Title from '$components/listing/cards/Title.svelte';

	export let card: ListingCard;

	let editedCard: ListingCard = { ...card };
	let checked = false;
	let addingOtherField = false;
	let showDeleteModal = false;
	let formLoading = false;

	function resetEditedCard(_) {
		editedCard = { ...card };
	}

	$: resetEditedCard(card); // needed for reactivity if the card changes from load function

	function updateField(index: number, eventDetail) {
		editedCard.content_fields[index][eventDetail.key] = eventDetail.value;
	}

	function addField(type: FieldTypes) {
		const newField = createEmptyField(type);
		editedCard.content_fields.push(newField);
		editedCard = { ...editedCard };
	}

	async function saveEdit() {
		editedCard.last_changed = new Date().toISOString();

		const toastId = toast.loading('Updating card...');

		const resp = await fetch('/api/listing/card', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ card: editedCard })
		});

		if (!resp.ok) {
			console.error('Error updating card:', resp.statusText);
			toast.error('Error updating card.', { id: toastId });
			return;
		}

		setTimeout(() => {
			toast.success('Card updated.', { id: toastId });
		}, $toastPromiseDelayMs);

		invalidateAll();
	}

	function deleteField(fieldId: string) {
		editedCard.content_fields = editedCard.content_fields.filter((f) => f.id !== fieldId);
	}

	function moveFieldUp(index: number) {
		if (index > 0) {
			const [movedItem] = editedCard.content_fields.splice(index, 1);
			editedCard.content_fields.splice(index - 1, 0, movedItem);
			editedCard = { ...editedCard }; // Ensure reactivity
		}
	}

	function moveFieldDown(index: number) {
		if (index < editedCard.content_fields.length - 1) {
			const [movedItem] = editedCard.content_fields.splice(index, 1);
			editedCard.content_fields.splice(index + 1, 0, movedItem);
			editedCard = { ...editedCard }; // Ensure reactivity
		}
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function toggleChecked() {
		checked = !checked;
	}
</script>

<input type="radio" name="my-accordion-1" {checked} on:click={toggleChecked} />

<div class="collapse-title">
	<Title bind:title={editedCard.title} />
</div>

<div id="sortable-list" class="collapse-content flex flex-col gap-2">
	{#if editedCard.content_fields}
		{#each editedCard.content_fields as field, index (field.id)}
			<div class="flex items-center">
				<div class="flex-grow">
					{#if field.type === 'text'}
						<TextFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
					{:else if field.type === 'video'}
						<VideoFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
					{:else if field.type === 'address'}
						<AddressFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
					{:else if field.type === 'link'}
						<LinkFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
					{/if}
				</div>
				{#if $editMode}
					<div class="flex flex-col justify-center items-center ml-2 gap-2">
						{#if index > 0}
							<button class="btn btn-outline btn-sm" on:click={() => moveFieldUp(index)}>↑</button>
						{/if}
						<button class="btn btn-error btn-outline btn-sm" on:click={() => deleteField(field.id)}
							>X</button
						>
						{#if index < editedCard.content_fields.length - 1}
							<button class="btn btn-outline btn-sm" on:click={() => moveFieldDown(index)}>↓</button
							>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	{/if}

	{#if $editMode}
		<div class="flex justify-between gap-4 p-4">
			{#if addingOtherField}
				<button
					class="btn btn-outline btn-primary"
					on:click={() => {
						addingOtherField = false;
					}}
				>
					&lt;
				</button>

				<button class="btn btn-outline" on:click={() => addField('link')}>Link Field</button>
				<button class="btn btn-outline" on:click={() => addField('address')}>Address Field</button>
				<button class="btn btn-outline" on:click={() => addField('video')}>Video Field</button>
			{:else}
				<button class="btn btn-outline" on:click={() => addField('text')}>Add Text Field</button>
				<button
					class="btn btn-outline"
					on:click={() => {
						addingOtherField = true;
					}}>Add Other Field</button
				>
			{/if}
			<button class="btn btn-primary" on:click={saveEdit}>Save All</button>
			<button class="btn btn-error btn-outline" on:click={openDeleteModal}>Delete</button>
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
							}, $toastPromiseDelayMs);
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
