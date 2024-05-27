<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { editMode } from '$lib/stores/store';
	import ListingCard from './ListingCard.svelte';

	export let infos = [];

	let showAddModal = false;
	let newRecommendation = {
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

	function handleDndConsider(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		recommendations = newItems;
	}

	function handleDndFinalize(event: CustomEvent<DndEvent>) {
		const { items: newItems } = event.detail;
		recommendations = newItems;
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
				<ListingCard card={recommendation} />
			</div>
		{/each}
	</div>

	{#if showAddModal}
		<dialog class="modal modal-open modal-bottom sm:modal-middle">
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
		</dialog>
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
