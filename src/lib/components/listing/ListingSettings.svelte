<!-- src/lib/ModalForm.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import PublicLink from '$components/listing/PublicLink.svelte';
	import { showListingSettings } from '$lib/stores/store';
	import { page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { onMount } from 'svelte';

	$showListingSettings = false;

	export let currentListing;

	let isPublic = currentListing.public;
	let showDeleteModal = false;
	let showUnpublishModal = false;
	let showPublishModal = false;
	let userInputName = '';
	let deleteConfirmed = false;

	function onSubmit() {
		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'success') {
				isPublic = !isPublic;
				currentListing.public = isPublic;
				toast.success(
					isPublic ? 'Listing published successfully!' : 'Listing unpublished successfully!'
				);
				closeUnpublishModal();
				closePublishModal();
			} else {
				update();
			}
		};
	}

	function onDelete() {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				toast.success('Listing deleted successfully!');
				$showListingSettings = false;
				goto('/private/' + $page.data.session.user.id + '/listings');
			}
		};
	}

	function closeEditModal() {
		$showListingSettings = false;
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		userInputName = '';
		deleteConfirmed = false;
	}

	function openUnpublishModal() {
		showUnpublishModal = true;
	}

	function closeUnpublishModal() {
		showUnpublishModal = false;
	}

	async function checkPublishAllowed() {
		const response = await fetch('/api/listing/publish-allowed', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			const { message } = await response.json();
			console.error('Unable to publish:', message);
			return;
		}

		const data = await response.json();

		return data.canPublishMoreListings;
	}

	function openPublishModal() {
		showPublishModal = true;
	}

	function closePublishModal() {
		showPublishModal = false;
	}
</script>

{#if $showListingSettings}
	<div class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Edit Listing</h3>
			<div class="mt-4">
				<PublicLink {isPublic} listingId={currentListing.id} listingHash={currentListing.hash} />
			</div>
			<div class="mt-4">
				{#await checkPublishAllowed()}
					<div class="skeleton h-12 w-full"></div>
				{:then canPublishMoreListings}
					{#if canPublishMoreListings || isPublic}
						<button
							type="button"
							class="btn btn-primary btn-block"
							on:click={() => {
								isPublic ? openUnpublishModal() : openPublishModal();
							}}
							disabled={!canPublishMoreListings && !isPublic}
						>
							{isPublic ? 'Unpublish' : 'Publish'} Listing
						</button>
					{:else}
						<div class="alert">
							<p>
								You have reached the maximum number of published listings. Please <a
									class="link"
									href="/private/{$page.data.session.user.id}/subscription"
									>update your subscription</a
								> or unpublish one of your other listings to publish this one.
							</p>
						</div>
					{/if}
				{/await}
			</div>

			<button
				type="button"
				class="btn btn-error btn-outline btn-block mt-4"
				on:click={openDeleteModal}
			>
				Delete Listing
			</button>

			<div class="modal-action">
				<button class="btn" on:click={closeEditModal}>Close</button>
			</div>
		</div>
	</div>
{/if}
{#if showDeleteModal}
	<div class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Deletion</h3>
			<p class="py-4">
				Please type the name of the listing <strong>{currentListing.name}</strong> to confirm deletion.
			</p>
			<input type="text" bind:value={userInputName} class="input input-bordered w-full" />
			<div class="modal-action justify-end align-center">
				<button class="btn mr-2" on:click={closeDeleteModal}>Cancel</button>
				<form method="POST" action="?/delete" class="inline" use:enhance={onDelete}>
					<input type="hidden" name="id" value={currentListing.id} />
					<button
						type="submit"
						class="btn btn-error"
						disabled={userInputName !== currentListing.name}>Delete</button
					>
				</form>
			</div>
		</div>
	</div>
{/if}

{#if showUnpublishModal}
	<div class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Unpublishing</h3>
			<p class="py-4">
				Are you sure you want to unpublish this listing? This will make the link inaccessible to
				anyone.
			</p>
			<div class="modal-action justify-end align-center">
				<button class="btn mr-2" on:click={closeUnpublishModal}>Cancel</button>
				<form method="POST" action="?/publish" class="inline" use:enhance={onSubmit}>
					<input type="hidden" name="id" value={currentListing.id} />
					<input type="hidden" name="public" value={!isPublic} />
					<button type="submit" class="btn btn-warning">Unpublish</button>
				</form>
			</div>
		</div>
	</div>
{/if}

{#if showPublishModal}
	<div class="modal modal-open modal-bottom sm:modal-middle">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Publish</h3>
			<p class="py-4">
				This will publish it with its unique URL. If you have already shared the link, it will be
				accessible until you either unpublish the listing or click the change URL button.
			</p>
			<div class="modal-action justify-end align-center">
				<button class="btn mr-2" on:click={closePublishModal}>Cancel</button>
				<form method="POST" action="?/publish" class="inline" use:enhance={onSubmit}>
					<input type="hidden" name="id" value={currentListing.id} />
					<input type="hidden" name="public" value={!isPublic} />
					<button type="submit" class="btn btn-primary">Publish</button>
				</form>
			</div>
		</div>
	</div>
{/if}
