<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { editMode } from '$lib/stores/store';

	type Recommendation = {
		id: number;
		title: string;
		description: string;
		address: string;
	};

	let recommendations: Recommendation[] = [
		{
			id: 1,
			title: 'Central Park',
			description: 'Enjoy a stroll or a picnic in the iconic Central Park.',
			address: 'New York, NY'
		},
		{
			id: 2,
			title: 'Empire State Building',
			description: 'Visit the famous Empire State Building for stunning city views.',
			address: '350 5th Avenue, New York, NY 10118'
		},
		{
			id: 3,
			title: 'Times Square',
			description: 'Experience the vibrant atmosphere of Times Square.',
			address: 'Manhattan, NY 10036'
		}
	];

	let showAddModal = false;
	let showDeleteModal = false;
	let showCardModal = false;
	let selectedRecommendation: Recommendation | null = null;
	let newRecommendation: Recommendation = {
		id: 0,
		title: '',
		description: '',
		address: ''
	};

	function openAddModal() {
		newRecommendation = {
			id: recommendations.length + 1,
			title: '',
			description: '',
			address: ''
		};
		showAddModal = true;
	}

	function addRecommendation() {
		recommendations = [...recommendations, newRecommendation];
		showAddModal = false;
	}

	function openDeleteModal(recommendation: Recommendation) {
		selectedRecommendation = recommendation;
		showDeleteModal = true;
	}

	function deleteRecommendation() {
		recommendations = recommendations.filter((rec) => rec.id !== selectedRecommendation?.id);
		showDeleteModal = false;
	}

	function openCardModal(recommendation: Recommendation) {
		selectedRecommendation = recommendation;
		showCardModal = true;
	}

	function handleDndConsider(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		recommendations = newItems;
	}

	function handleDndFinalize(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		recommendations = newItems;
	}

	function openDirections(address: string) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

<div class="container mx-auto px-4">
	{#if $editMode}
		<button class="btn btn-secondary mb-4 ml-2" on:click={openAddModal}>Add Recommendation</button>
	{/if}

	<div
		class="grid grid-cols-1 md:grid-cols-2 gap-4"
		use:dndzone={{
			items: recommendations,
			flipDurationMs: 200,
			dropTargetStyle: {},
			dragDisabled: !$editMode
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each recommendations as recommendation (recommendation.id)}
			<div class="card bg-base-100 bg-opacity-75 shadow-2xl m-2" animate:flip={{ duration: 200 }}>
				<div class="card-body">
					<h2 class="card-title">{recommendation.title}</h2>
					<div class="flex-grow">
						<p class="line-clamp-3 md:line-clamp-4">{recommendation.description}</p>
					</div>
					<div class="card-actions justify-end">
						<button class="btn btn-primary" on:click={() => openCardModal(recommendation)}
							>View</button
						>
						{#if $editMode}
							<button class="btn btn-error" on:click={() => openDeleteModal(recommendation)}
								>Delete</button
							>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if showAddModal}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Add Recommendation</h3>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Title</span>
					</label>
					<input type="text" class="input input-bordered" bind:value={newRecommendation.title} />
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Description</span>
					</label>
					<textarea class="textarea textarea-bordered" bind:value={newRecommendation.description}
					></textarea>
				</div>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Address</span>
					</label>
					<input type="text" class="input input-bordered" bind:value={newRecommendation.address} />
				</div>
				<div class="modal-action">
					<button class="btn btn-primary" on:click={addRecommendation}>Add</button>
					<button class="btn" on:click={() => (showAddModal = false)}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showDeleteModal && selectedRecommendation}
		<div class="modal modal-open">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Confirm Delete</h3>
				<p class="py-4">
					Are you sure you want to delete the recommendation "{selectedRecommendation.title}"?
				</p>
				<div class="modal-action">
					<button class="btn btn-error" on:click={deleteRecommendation}>Delete</button>
					<button class="btn" on:click={() => (showDeleteModal = false)}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}

	{#if showCardModal && selectedRecommendation}
		<div class="modal modal-open">
			<div class="modal-box">
				<h2 class="font-bold text-2xl">{selectedRecommendation.title}</h2>
				<p class="py-4">{selectedRecommendation.description}</p>
				<p><strong>Address:</strong> {selectedRecommendation.address}</p>
				<div class="modal-action">
					<button
						class="btn btn-primary"
						on:click={() => openDirections(selectedRecommendation?.address || '')}
						>Get Directions</button
					>
					<button class="btn" on:click={() => (showCardModal = false)}>Close</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
