<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let data;

	let currentListing = data.listings.find(
		(listing) => listing.id === parseInt($page.params.listingId)
	);

	let isPublic = currentListing.public;

	function onSubmit() {
		return ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'success') {
				console.log('Listing updated successfully!');
				isPublic = !isPublic;
				currentListing.public = isPublic;
			} else {
				update();
			}
		};
	}

	$: console.log(currentListing);
</script>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
	<div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
		<h1 class="text-2xl font-bold mb-6">Edit Listing</h1>
		<form method="POST" class="space-y-4" use:enhance={onSubmit}>
			<input type="hidden" name="id" value={currentListing.id} />

			<label class="label cursor-pointer flex justify-between items-center">
				<span class="label-text">Public:</span>
				<input type="checkbox" class="toggle toggle-primary" name="public" checked={isPublic} />
			</label>

			<button type="submit" class="btn btn-primary w-full">Update</button>
		</form>

		{#if currentListing.public}
			<div class="mt-4">
				<a
					class="link link-hover"
					href="/public/listings/{currentListing.id}?hash={currentListing.hash}"
				>
					View Public Endpoint
				</a>
			</div>
		{/if}
	</div>
</div>
