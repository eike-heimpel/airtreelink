<script lang="ts">
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data;

	let newQuantity = data.subscription?.items.data[0].quantity || 1;
	let loading = false;

	function updateQuantity(change: number) {
		if (newQuantity + change >= 1) {
			newQuantity += change;
		}
	}

	const handleFormSubmit = ({ formElement, formData, action, cancel, submitter }) => {
		// Display initial loading toast
		const toastId = toast.loading('Processing...');

		return async ({ result, update }) => {
			try {
				const response = await result;

				if (response.type === 'success') {
					toast.success('Operation successful!', { id: toastId });
				} else {
					toast.error('Operation failed!', { id: toastId });
				}

				update(); // Call update() to trigger default behavior
			} catch (error) {
				toast.error('Operation failed!', { id: toastId });
			}
		};
	};
</script>

<div class="max-w-lg mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-lg">
	<h1 class="text-2xl font-semibold mb-6 text-center">Subscription Info</h1>
	{#if data.subscription}
		<div class="mb-6">
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Quantity:</span>
				<span>{data.subscription.items.data[0].quantity}</span>
			</div>
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Status:</span>
				<span>{data.subscription.status}</span>
			</div>
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Next Billing Date:</span>
				<span>
					{#if data.subscription.cancel_at_period_end || data.subscription.status !== 'active'}
						<span class="text-red-500">Canceled</span>
					{:else}
						{new Date(data.subscription.current_period_end * 1000).toLocaleDateString()}
					{/if}
				</span>
			</div>
			{#if data.subscription.cancel_at_period_end && data.subscription.cancel_at}
				<div class="flex justify-between items-center mb-4">
					<span class="font-medium">Cancellation Date:</span>
					<span>{new Date(data.subscription.cancel_at * 1000).toLocaleDateString()}</span>
				</div>
				<p class="text-center text-sm text-gray-500 w-full break-words mb-4">
					Your subscription will be canceled at the end of the current billing period.
				</p>
			{/if}
		</div>

		<div class="mb-6">
			<label class="label mb-2" for="subscriptionQuantity">Update Subscription Quantity</label>
			<div class="flex items-center justify-center space-x-2 mb-2">
				<button
					class="btn btn-primary"
					id="decreaseQuantity"
					on:click={() => updateQuantity(-1)}
					disabled={newQuantity <= 1}
				>
					-
				</button>
				<div class="flex items-center justify-center">
					<input
						type="number"
						id="subscriptionQuantity"
						class="input input-bordered w-20 text-center"
						bind:value={newQuantity}
						readonly
					/>
				</div>
				<button class="btn btn-primary" id="increaseQuantity" on:click={() => updateQuantity(1)}>
					+
				</button>
			</div>
			{#if newQuantity >= 5}
				<p class="text-center text-sm text-gray-500 w-full break-words">
					Contact Support for more listings.
				</p>
			{/if}
			<form method="post" action="?/updateSubscription" use:enhance={handleFormSubmit}>
				<input type="hidden" name="newQuantity" value={newQuantity} />
				<button class="btn btn-primary w-full" disabled={loading}>Update</button>
			</form>
		</div>

		{#if !data.subscription.cancel_at_period_end}
			<form method="post" action="?/cancelSubscription" use:enhance={handleFormSubmit}>
				<button class="btn btn-error btn-outline w-full" disabled={loading}>
					Cancel Subscription
				</button>
			</form>
		{:else}
			<!-- Renew Button will be implemented later -->
			<button class="btn btn-success w-full" disabled>Renew Subscription</button>
		{/if}
	{:else}
		<p class="text-center">You currently do not have a subscription.</p>
	{/if}
	<Toaster />
</div>
