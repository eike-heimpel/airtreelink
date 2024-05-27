<script lang="ts">
	import { editMode } from '$lib/stores/store';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';

	type ContentField = {
		type: string;
		content: string;
		url?: string;
	};

	type CardData = {
		id: number;
		created_at: string;
		last_changed: string;
		title: string;
		description: string | null;
		listing_id: number;
		content_fields: ContentField[];
		type: string | null;
		is_recommended: boolean;
		user_id: string;
	};

	export let card: CardData;

	let formLoading = false;
	let showDeleteModal = false;
	let showCardModal = false;
	let showEditModal = false;
	let editedCard: CardData = { ...card };

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function openEditModal() {
		editedCard = { ...card };
		showEditModal = true;
	}

	function saveEdit() {
		// Placeholder function for updating the card

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
		}, $toastPromiseDelayMs); // give the site some time to update

		invalidateAll();
	}

	function openDirections(address: string) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

<input type="radio" name="my-accordion-1" />

<div class="collapse-title text-xl font-medium">
	{card.title}
</div>

<div class="collapse-content flex flex-col gap-2">
	{#each card.content_fields as field}
		{#if field.type === 'text'}
			<p class="mt-2 text-neutral">{field.content}</p>
		{:else if field.type === 'video' && field.url}
			<div class="mt-4">
				<iframe
					class="w-full aspect-video"
					src={field.url}
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					title="Video"
				></iframe>
			</div>
		{:else if field.type === 'address'}
			<address class="mt-2 not-italic text-secondary">
				<button
					class="btn btn-primary"
					on:click={() =>
						openDirections(
							card.content_fields.find((field) => field.type === 'address')?.content || ''
						)}
				>
					Get Directions
				</button>
			</address>
		{:else if field.type === 'link' && field.url}
			<a class="link" href={field.url} target="_blank" rel="noopener noreferrer">{field.content}</a>
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
			<p class="py-4">
				Are you sure you want to delete your "{card.title}" card?
			</p>
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
