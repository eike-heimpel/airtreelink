<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Links from '$components/listing/Links.svelte';
	import ListingImages from '$components/listing/ListingImages.svelte';
	import PublicLink from '$components/listing/PublicLink.svelte';
	import Recommendations from '$components/listing/Recommendations.svelte';
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

	let showLinksModal = false;
	let currentDetail = null;

	function openModal(detail) {
		currentDetail = detail;
		showLinksModal = true;
	}

	function closeModal() {
		showLinksModal = false;
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
	<h1 class="text-4xl font-bold mb-2">{currentListing.name}</h1>
	<ListingImages />
	<div class="btn"><a href="{$page.url.pathname}/recommendations">Recommendations</a></div>
	<div class="flex flex-col md:flex-row gap-4 w-full justify-center">
		<div class="shadow-lg bg-base-100 rounded-lg p-6 max-w-xl sm:max-w-full">
			<h2 class="text-xl font-bold mb-6">Manage Links</h2>
			<Links />
		</div>
		<div class="shadow-lg bg-base-100 rounded-lg p-6 w-full max-w-md sm:max-w-sm self-start">
			<form method="POST" action="?/publish" class="space-y-4" use:enhance={onSubmit}>
				<input type="hidden" name="id" value={currentListing.id} />
				<input type="hidden" name="public" value={!isPublic} />

				<button type="submit" class="btn btn-primary w-full">
					{isPublic ? 'Unpublish' : 'Publish'} Listing
				</button>
			</form>

			<button type="button" class="btn btn-error w-full mt-4" on:click={openDeleteModal}
				>Delete Listing</button
			>

			<div class="mt-4">
				<PublicLink {isPublic} listingId={currentListing.id} listingHash={currentListing.hash} />
			</div>
		</div>
	</div>
</div>

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
