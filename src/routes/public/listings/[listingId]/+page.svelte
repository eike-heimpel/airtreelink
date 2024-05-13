<script lang="ts">
	export let data;

	let showModal = false;
	let currentDetail = null;

	// Function to handle modal opening
	function openModal(detail) {
		currentDetail = detail;
		showModal = true;
	}

	// Function to close the modal
	function closeModal() {
		showModal = false;
	}

	console.log(data.listing);
</script>

<div class="p-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-center mb-4">{data.listing.name}</h1>
		<p class="text-gray-600 text-center mb-6">{data.listing.description}</p>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				class="card bg-base-100 shadow-xl cursor-pointer"
				on:click={() => openModal(data.listing.listings_data.link)}
			></div>
		</div>
	</div>

	{#if showModal}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="font-bold text-lg">{currentDetail.title}</h3>
				<p class="py-4">{currentDetail.description}</p>
				<div class="modal-action">
					<button class="btn" on:click={closeModal}>Close</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Additional styles if needed */
</style>
