<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	export let data;

	let name = '';
	let description = '';
	let title_image_url = '';
	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function enhanceForm() {
		return async ({ result, update }: { result: any; update: any }) => {
			if (result.type === 'success') {
				console.log('Listing added successfully!');
				closeModal();
				invalidateAll();
				name = '';
				description = '';
				title_image_url = '';
			} else {
				update();
			}
		};
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
				<img
					src={listing.title_image_url}
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
		<div class="modal modal-open">
			<div class="modal-box">
				<h2 class="font-bold text-lg mb-4">Add New Listing</h2>
				<form method="post" use:enhance={enhanceForm}>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Name</label>
						<input
							type="text"
							name="name"
							bind:value={name}
							class="input input-bordered w-full"
							required
						/>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Description</label>
						<textarea
							name="description"
							bind:value={description}
							class="textarea textarea-bordered w-full"
							required
						></textarea>
					</div>
					<div class="mb-4">
						<label class="block text-sm font-medium mb-1">Title Image URL</label>
						<input
							type="url"
							name="title_image_url"
							bind:value={title_image_url}
							class="input input-bordered w-full"
							required
						/>
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
