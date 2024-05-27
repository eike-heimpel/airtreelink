<script lang="ts">
	import { editMode } from '$lib/stores/store';

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

	let showDeleteModal = false;
	let showCardModal = false;

	function openCardModal() {
		showCardModal = true;
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function deleteRecommendation() {
		showDeleteModal = false;
		const event = new CustomEvent('delete');
		dispatchEvent(event);
	}

	function openDirections(address: string) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

<div class="card-body">
	<h2 class="card-title text-2xl font-bold">{card.title}</h2>
	<div class="card-actions justify-end">
		<button class="btn btn-primary" on:click={openCardModal}>View</button>
		{#if $editMode}
			<button class="btn btn-error" on:click={openDeleteModal}>Delete</button>
		{/if}
	</div>
</div>

{#if showDeleteModal}
	<dialog class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Delete</h3>
			<p class="py-4">
				Are you sure you want to delete the recommendation "{card.title}"?
			</p>
			<div class="modal-action">
				<button class="btn btn-error" on:click={deleteRecommendation}>Delete</button>
				<button class="btn" on:click={() => (showDeleteModal = false)}>Cancel</button>
			</div>
		</div>
	</dialog>
{/if}

{#if showCardModal}
	<dialog class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h2 class="font-bold text-2xl">{card.title}</h2>
			<div class="flex flex-col gap-2">
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
						<a class="link" href={field.url} target="_blank" rel="noopener noreferrer"
							>{field.content}</a
						>
					{/if}
				{/each}
				<div class="modal-action">
					<button class="btn" on:click={() => (showCardModal = false)}>Close</button>
				</div>
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
