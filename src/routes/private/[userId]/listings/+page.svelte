<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import FileUpload from '$components/utility/FileUpload.svelte';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	export let data;

	let name = '';
	let description = '';
	let tempImage: {
		file: File;
		base64String: null;
		fullTempFile: null;
	} | null = null;

	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleFileUploaded({ detail: { file, base64String, fullTempFile } }) {
		tempImage = {
			file,
			base64String,
			fullTempFile
		};
	}

	$: console.log(tempImage);

	function createListing({ cancel }) {
		// don't allow if they have more than 5 listings already
		if (data.listings.length >= 5) {
			toast.error('You have reached the maximum number of listings allowed.');
			cancel();
			closeModal();
		}

		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'success') {
				toast.success('Listing created successfully!');
				update();
				closeModal();
			}

			if (result.type === 'error') {
				toast.error('Error creating listing. Please try again.');
				closeModal();
			}

			name = '';
			description = '';
			tempImage = null;
		};
	}

	function deleteTempImage() {
		tempImage = null;
	}
</script>

<div class="min-h-screen flex flex-wrap gap-10 items-center justify-center p-4 relative">
	{#each data.listings as listing}
		<button
			class="card w-full max-w-lg bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out relative"
			on:click={() => goto(`listings/${listing.id}`)}
			on:keydown={(event) => {
				if (event.key === 'Enter') goto(`listings/${listing.id}`);
			}}
		>
			<figure class="overflow-hidden h-64 w-full">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img
					src={`${PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images/${listing.hash}/${listing.title_image_url}.webp`}
					alt="Listing Image"
					class="transition-transform duration-300 ease-in-out hover:scale-105 object-cover w-full h-full"
				/>
			</figure>
			<div class="card-body w-full">
				<div class="flex justify-between items-center">
					<h2 class="card-title">{listing.name}</h2>
					{#if listing.public}
						<div class="badge badge-accent">Public</div>
					{/if}
				</div>
				<p>{listing.description}</p>
			</div>
		</button>
	{/each}

	<button class="btn btn-circle btn-primary fixed bottom-10 right-10" on:click={openModal}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="inline-block w-6 h-6 stroke-current"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
			></path>
		</svg>
	</button>

	{#if showModal}
		<div class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box w-full max-w-4xl sm:max-w-6xl">
				<h2 class="font-bold text-lg mb-4">Add New Listing</h2>
				<form method="post" use:enhance={createListing}>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1" for="name">Name</label>
						<input
							type="text"
							name="name"
							bind:value={name}
							class="input input-bordered w-full"
							required
						/>
					</div>
					<div class="mb-4">
						<div class="text-sm font-medium mb-1 flex justify-center items-center">Title Image</div>

						{#if tempImage?.file}
							<div class="relative">
								<div class="flex justify-center items-center">
									<img
										src={tempImage.fullTempFile}
										alt={tempImage.file.name}
										class="mb-3 rounded w-1/2 md:w-1/3"
									/>
								</div>

								<button
									class="btn btn-sm btn-circle absolute top-2 right-2"
									on:click={deleteTempImage}>✕</button
								>
							</div>
							<input type="hidden" name="titleImageBase64" value={tempImage.base64String} />
						{:else}
							<FileUpload
								on:fileUploaded={handleFileUploaded}
								minimumImageWidth={1920}
								minimumImageHeight={1080}
							/>
							<p class="italic text-accent text-sm p-2">
								Minimum 1920x1080, we will resize it for different devices
							</p>
						{/if}
					</div>

					<div class="flex justify-end gap-2">
						<button type="button" class="btn" on:click={closeModal}>Cancel</button>
						<button type="submit" class="btn btn-primary">Add Listing</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Center the modal */
	.modal.modal-open {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Ensure all listings have the same size */
	.card figure {
		height: 16rem;
	}
</style>
