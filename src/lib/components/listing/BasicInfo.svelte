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

<div
	class="container mx-auto px-4 py-8 text-shadow flex flex-col items-center justify-around gap-4"
>
	<div class="divider divider-accent">
		<h2 class="text-xl font-semibold text-accent">Description</h2>
	</div>
	<div class="">
		{#if $editMode}
			<textarea class="textarea textarea-bordered text-black w-96 max-w-xs" bind:value={description}
			></textarea>
		{:else}
			<p class="text-lg">{description}</p>
		{/if}
		<div class="flex justify-end mt-4">
			{#if $editMode}
				<button class="btn btn-secondary mr-2">
					{$editMode ? 'Save' : 'Edit'}
				</button>
				<button class="btn btn-error">Remove</button>
			{/if}
		</div>
	</div>
	<div class="divider divider-accent">
		<h2 class="text-xl font-semibold text-accent">Address</h2>
	</div>

	<div class="">
		{#if $editMode}
			<input
				class="input input-bordered text-black w-96 max-w-xs"
				type="text"
				bind:value={address}
			/>
		{:else}
			<p class="text-lg">{address}</p>
		{/if}
		<div class="flex justify-center mt-4">
			<button
				class="btn btn-primary btn-outline mr-2"
				class:hidden={$editMode}
				on:click={openGoogleMaps}>Get Directions</button
			>
			{#if $editMode}
				<button class="btn btn-secondary mr-2">
					{$editMode ? 'Save' : 'Edit'}
				</button>
				<button class="btn btn-error">Remove</button>
			{/if}
		</div>
	</div>

	<div class="divider divider-accent">
		<h2 class="text-xl font-semibold text-accent">Contact Information</h2>
	</div>
	<div class="">
		{#if $editMode}
			<input
				class="input input-bordered text-black w-96 max-w-xs mb-2"
				type="text"
				bind:value={contact.name}
				placeholder="Name"
			/>
			<input
				class="input input-bordered text-black w-96 max-w-xs mb-2"
				type="text"
				bind:value={contact.phone}
				placeholder="Phone Number"
			/>
			<input
				class="input input-bordered text-black w-96 max-w-xs mb-2"
				type="text"
				bind:value={contact.email}
				placeholder="Email"
			/>
		{:else}
			<p class="text-lg"><strong>Name:</strong> {contact.name}</p>
			<p class="text-lg"><strong>Phone:</strong> {contact.phone}</p>
			<p class="text-lg"><strong>Email:</strong> {contact.email}</p>
		{/if}
		<div class="flex justify-end mt-4">
			{#if $editMode}
				<button class="btn btn-secondary mr-2">
					{$editMode ? 'Save' : 'Edit'}
				</button>
				<button class="btn btn-error">Remove</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.text-shadow {
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
		color: white; /* Ensure text is readable on dark backgrounds */
	}
</style>
