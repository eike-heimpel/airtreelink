<script lang="ts">
	import { editMode } from '$lib/stores/store';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import type { Database } from '$lib/types/supabase';
	import type { ContentField } from '$lib/types/fields';

	import TextFieldComponent from '$components/fields/TextField.svelte';
	import VideoFieldComponent from '$components/fields/VideoField.svelte';
	import AddressFieldComponent from '$components/fields/AddressField.svelte';
	import LinkFieldComponent from '$components/fields/LinkField.svelte';

	type ListingCard = Omit<
		Database['public']['Tables']['listing_cards']['Row'],
		'content_fields'
	> & {
		content_fields: ContentField[];
	};

	export let card: ListingCard;

	let formLoading = false;
	let showDeleteModal = false;
	let showEditModal = false;
	let editedCard: ListingCard = { ...card };

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function openEditModal() {
		editedCard = { ...card };
		showEditModal = true;
	}

	function saveEdit() {
		editedCard.last_changed = new Date().toISOString();
		updateCard();
		showEditModal = false;
	}

	async function updateCard() {
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
</script>

<input type="radio" name="my-accordion-1" />

<div class="collapse-title text-xl font-medium">
	{card.title}
</div>

<div class="collapse-content flex flex-col gap-2">
	{#each card.content_fields as field}
		{#if field.type === 'text'}
			<TextFieldComponent {field} />
		{:else if field.type === 'video'}
			<VideoFieldComponent {field} />
		{:else if field.type === 'address'}
			<AddressFieldComponent {field} />
		{:else if field.type === 'link'}
			<LinkFieldComponent {field} />
		{/if}
	{/each}

	{#if $editMode}
		<div class="flex justify-end gap-4 p-4">
			<button class="btn btn-accent" on:click={openEditModal}>Edit</button>
			<button class="btn btn-error" on:click={openDeleteModal}>Delete</button>
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

{#if showEditModal}
	<dialog class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Edit Card</h3>
			<div class="form-control">
				<label class="label">
					<span class="label-text">Title</span>
				</label>
				<input type="text" class="input input-bordered" bind:value={editedCard.title} />
			</div>

			{#each editedCard.content_fields as field, index (field.type)}
				{#if field.type === 'text'}
					<div class="form-control">
						<label class="label">
							<span class="label-text">Text Content</span>
						</label>
						<textarea
							class="textarea textarea-bordered"
							bind:value={editedCard.content_fields[index].content}
						></textarea>
					</div>
				{:else if field.type === 'video'}
					<div class="form-control">
						<label class="label">
							<span class="label-text">Video URL</span>
						</label>
						<input
							type="text"
							class="input input-bordered"
							bind:value={editedCard.content_fields[index].url}
						/>
					</div>
				{:else if field.type === 'address'}
					<div class="form-control">
						<label class="label">
							<span class="label-text">Address</span>
						</label>
						<input
							type="text"
							class="input input-bordered"
							bind:value={editedCard.content_fields[index].content}
						/>
					</div>
				{:else if field.type === 'link'}
					<div class="form-control">
						<label class="label">
							<span class="label-text">Link Text</span>
						</label>
						<input
							type="text"
							class="input input-bordered"
							bind:value={editedCard.content_fields[index].content}
						/>
						<label class="label">
							<span class="label-text">Link URL</span>
						</label>
						<input
							type="text"
							class="input input-bordered"
							bind:value={editedCard.content_fields[index].url}
						/>
					</div>
				{/if}
			{/each}
			<div class="modal-action">
				<button class="btn btn-primary" on:click={saveEdit}>Save</button>
				<button class="btn" on:click={() => (showEditModal = false)}>Cancel</button>
			</div>
		</div>
	</dialog>
{/if}

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
