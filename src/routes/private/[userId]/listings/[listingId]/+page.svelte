<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Links from '$components/listing/Links.svelte';
	import PublicLink from '$components/listing/PublicLink.svelte';
	import Recommendations from '$components/listing/Recommendations.svelte';
	import { showListingSettings } from '$lib/stores/store';
	import ListingView from '$components/ListingView.svelte';

	export let data;

	let currentListing = data.listings.find(
		(listing) => listing.id === parseInt($page.params.listingId)
	);

	let isPublic = currentListing.public;
	let showDeleteModal = false;
	let userInputName = '';
	let deleteConfirmed = false;

	function onSubmit() {
		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'success') {
				console.log('Listing updated successfully!');
				isPublic = !isPublic;
				currentListing.public = isPublic;
			} else {
				update();
			}
		};
	}

	function onDelete() {
		return async ({ result }: { result: any }) => {
			if (result.type === 'success') {
				goto('/private/' + data.session.user.id + '/listings');
			}
		};
	}

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		userInputName = '';
		deleteConfirmed = false;
	}

	function closeEditModal() {
		$showListingSettings = false;
	}
</script>

<ListingView {currentListing} />

{#if $showListingSettings}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Edit Listing</h3>
			<form method="POST" action="?/publish" class="space-y-4" use:enhance={onSubmit}>
				<input type="hidden" name="id" value={currentListing.id} />
				<input type="hidden" name="public" value={!isPublic} />

				<button type="submit" class="btn btn-primary btn-block">
					{isPublic ? 'Unpublish' : 'Publish'} Listing
				</button>
			</form>

			<button type="button" class="btn btn-error btn-block mt-4" on:click={openDeleteModal}>
				Delete Listing
			</button>

			<div class="mt-4">
				<PublicLink {isPublic} listingId={currentListing.id} listingHash={currentListing.hash} />
			</div>

			<div class="modal-action">
				<button class="btn" on:click={closeEditModal}>Close</button>
			</div>
		</div>
	</div>
{/if}

{#if showDeleteModal}
	<div class="modal modal-open">
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
