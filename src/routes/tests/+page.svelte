<script>
	import { onMount } from 'svelte';

	let message = '';

	async function handleCheckout() {
		try {
			const response = await fetch('/api/stripe/checkout');
			if (!response.ok) throw new Error('Failed to create checkout session');
			const { url } = await response.json();
			window.location.href = url;
		} catch (error) {
			console.error('Error:', error);
			message = 'Failed to initiate checkout. Please try again.';
		}
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
	<div class="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
		<h1 class="text-2xl font-bold mb-4">Subscribe to our Premium Plan</h1>
		<p class="mb-6">Get access to exclusive features by subscribing to our premium plan.</p>
		<button on:click={handleCheckout} class="btn btn-primary w-full mb-4"
			>Proceed to Checkout</button
		>
		{#if message}
			<div class="text-red-500 text-center">{message}</div>
		{/if}
	</div>
</div>
