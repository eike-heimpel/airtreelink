<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Links from '$components/listing/Links.svelte';
	import ListingImages from '$components/listing/ListingImages.svelte';
	import PublicLink from '$components/listing/PublicLink.svelte';

	export let data;

	let currentListing = data.listings.find(
		(listing) => listing.id === parseInt($page.params.listingId)
	);

	let isPublic = currentListing.public;

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

	let showLinksModal = false;
	let currentDetail = null;

	// Function to handle modal opening
	function openModal(detail) {
		currentDetail = detail;
		showLinksModal = true;
	}

	// Function to close the modal
	function closeModal() {
		showLinksModal = false;
	}
</script>

<div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 space-y-8">
	<!-- Image Slider component -->
	<ListingImages />

	<div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
		<h1 class="text-2xl font-bold mb-6">Edit Listing</h1>
		<form method="POST" class="space-y-4" use:enhance={onSubmit}>
			<input type="hidden" name="id" value={currentListing.id} />
			<input type="hidden" name="public" value={!isPublic} />

			<button type="submit" class="btn btn-primary w-full"
				>{isPublic ? 'Unpublish' : 'Publish'}</button
			>
		</form>
	</div>

	<!-- PublicLink component section -->
	<PublicLink {isPublic} listingId={currentListing.id} listingHash={currentListing.hash} />

	<!-- Links component section -->
	<div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
		<h2 class="text-xl font-bold mb-6">Manage Links</h2>
		<Links />
	</div>
</div>

{#if showLinksModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">{currentDetail?.title}</h3>
			<p class="py-4">{currentDetail?.description}</p>
			<div class="modal-action">
				<button class="btn" on:click={closeModal}>Close</button>
			</div>
		</div>
	</div>
{/if}
