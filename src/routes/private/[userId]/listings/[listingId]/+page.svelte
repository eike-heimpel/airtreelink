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

<div class="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
	<h1 class="text-4xl font-bold mb-10">Manage {currentListing.namen}</h1>
	<ListingImages />
	<div class="flex flex-col md:flex-row gap-4 w-full justify-center">
		<div class="shadow-lg bg-base-100 rounded-lg p-6 max-w-xl sm:max-w-full">
			<h2 class="text-xl font-bold mb-6">Manage Links</h2>
			<Links />
		</div>
		<div class="shadow-lg bg-base-100 rounded-lg p-6 w-full max-w-md sm:max-w-sm self-start">
			<form method="POST" class="space-y-4" use:enhance={onSubmit}>
				<input type="hidden" name="id" value={currentListing.id} />
				<input type="hidden" name="public" value={!isPublic} />

				<button type="submit" class="btn btn-primary w-full">
					{isPublic ? 'Unpublish' : 'Publish'} Listing
				</button>
			</form>

			<div class="mt-4">
				<PublicLink {isPublic} listingId={currentListing.id} listingHash={currentListing.hash} />
			</div>
		</div>
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
