<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Links from '$components/listing/Links.svelte';
	import PublicLink from '$components/listing/PublicLink.svelte';
	import Recommendations from '$components/listing/Recommendations.svelte';
	import { showListingSettings } from '$lib/stores/store';

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

	let activeTab = 'recommendations';

	function closeEditModal() {
		$showListingSettings = false;
	}

	$: console.log(activeTab);
</script>

<div
	class="hero min-h-screen w-full"
	style="background-image: url({currentListing.title_image_url});"
>
	<div class="hero-overlay bg-opacity-60"></div>

	<div class="h-full text-center">
		<div class="">
			<h1
				class="my-4 text-2xl font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-50"
			>
				{currentListing.name}
			</h1>
			<div class="">
				{#if activeTab === 'recommendations'}
					<Recommendations />
				{:else if activeTab === 'links'}
					<Links />
				{:else if activeTab === 'getStarted'}
					<p>Get Started content goes here.</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="fixed bottom-0 w-full bg-base-100 border-t border-neutral">
		<ul class="menu menu-horizontal w-full justify-around">
			<li>
				<a
					class="lg:text-2xl {activeTab === 'getStarted' ? 'active' : ''}"
					on:click={() => (activeTab = 'getStarted')}
				>
					Basics
				</a>
			</li>
			<li>
				<a
					class="lg:text-2xl {activeTab === 'links' ? 'active' : ''}"
					on:click={() => (activeTab = 'links')}
				>
					House Info
				</a>
			</li>
			<li>
				<a
					class="lg:text-2xl {activeTab === 'recommendations' ? 'active' : ''}"
					on:click={() => (activeTab = 'recommendations')}
				>
					Recommendations
				</a>
			</li>
		</ul>
	</div>
</div>

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

<style>
	.hero {
		background-size: cover;
		background-position: center;
	}
	.hero-overlay {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
