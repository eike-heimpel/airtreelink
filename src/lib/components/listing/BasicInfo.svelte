<script lang="ts">
	import { editMode } from '$lib/stores/store';
	import { onMount } from 'svelte';

	let address = '123 Main St, City, State, ZIP';
	let description = 'Welcome to our beautiful home! We hope you enjoy your stay.';
	let contact = {
		name: 'John Doe',
		phone: '(123) 456-7890',
		email: 'john.doe@example.com'
	};

	function openGoogleMaps() {
		const encodedAddress = encodeURIComponent(address);
		const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
		window.open(mapsUrl, '_blank');
	}
</script>

<div class="container mx-auto px-4 py-8">
	<div class="card bg-base-100 bg-opacity-75 shadow-xl mb-8">
		<div class="card-body">
			<h2 class="card-title">Description</h2>
			{#if $editMode}
				<textarea class="textarea textarea-bordered w-full" bind:value={description}></textarea>
			{:else}
				<p>{description}</p>
			{/if}
			<div class="card-actions justify-end">
				{#if $editMode}
					<button class="btn btn-secondary">
						{$editMode ? 'Save' : 'Edit'}
					</button>
					<button class="btn btn-error">Remove</button>
				{/if}
			</div>
		</div>
	</div>
	<div class="card bg-base-100 bg-opacity-75 shadow-xl mb-8">
		<div class="card-body">
			<h2 class="card-title">Address</h2>
			{#if $editMode}
				<input class="input input-bordered w-full" type="text" bind:value={address} />
			{:else}
				<p>{address}</p>
			{/if}
			<div class="card-actions justify-end">
				<button class="btn btn-primary" on:click={openGoogleMaps}>Get Directions</button>
				{#if $editMode}
					<button class="btn btn-secondary">
						{$editMode ? 'Save' : 'Edit'}
					</button>
					<button class="btn btn-error">Remove</button>
				{/if}
			</div>
		</div>
	</div>
	<div class="card bg-base-100 bg-opacity-75 shadow-xl mb-8">
		<div class="card-body">
			<h2 class="card-title">Contact Information</h2>
			{#if $editMode}
				<input
					class="input input-bordered w-full mb-2"
					type="text"
					bind:value={contact.name}
					placeholder="Name"
				/>
				<input
					class="input input-bordered w-full mb-2"
					type="text"
					bind:value={contact.phone}
					placeholder="Phone Number"
				/>
				<input
					class="input input-bordered w-full mb-2"
					type="text"
					bind:value={contact.email}
					placeholder="Email"
				/>
			{:else}
				<p><strong>Name:</strong> {contact.name}</p>
				<p><strong>Phone:</strong> {contact.phone}</p>
				<p><strong>Email:</strong> {contact.email}</p>
			{/if}
			<div class="card-actions justify-end">
				{#if $editMode}
					<button class="btn btn-secondary">
						{$editMode ? 'Save' : 'Edit'}
					</button>
					<button class="btn btn-error">Remove</button>
				{/if}
			</div>
		</div>
	</div>
</div>
