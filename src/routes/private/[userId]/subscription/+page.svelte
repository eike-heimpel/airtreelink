<script lang="ts">
	import { enhance } from '$app/forms';

	export let data;

	let profile = data.profile;
	let subscription = data.subscription;
	let newQuantity = profile.subscription_quantity || 1;

	let loading = false;

	function updateQuantity(change: number) {
		if (newQuantity + change >= 1) {
			newQuantity += change;
		}
	}
</script>

<div class="max-w-lg mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-lg">
	<h1 class="text-2xl font-semibold mb-6 text-center">Subscription Info</h1>
	{#if subscription}
		<div class="mb-6">
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Plan:</span>
				<span>{subscription.plan.nickname}</span>
			</div>
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Quantity:</span>
				<span>{subscription.items.data[0].quantity}</span>
			</div>
			<div class="flex justify-between items-center mb-4">
				<span class="font-medium">Status:</span>
				<span>{subscription.status}</span>
			</div>
			<div class="flex justify-between items-center">
				<span class="font-medium">Next Billing Date:</span>
				<span>{new Date(subscription.current_period_end * 1000).toLocaleDateString()}</span>
			</div>
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
			<form
				method="post"
				action="?/updateSubscription"
				use:enhance={({ formElement }) => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							await update();
							profile.subscription_quantity = newQuantity;
						} else if (result.type === 'error') {
							alert('Failed to update subscription');
						}
					};
				}}
			>
				<input type="hidden" name="newQuantity" value={newQuantity} />
				<button class="btn btn-primary w-full" disabled={loading}>Update</button>
			</form>
		</div>

		{#if subscription.status !== 'canceled'}
			<form
				method="post"
				action="?/cancelSubscription"
				use:enhance={({ formElement }) => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							await update();
							profile.subscription_status = 'canceled';
							subscription.status = 'canceled';
						} else if (result.type === 'error') {
							alert('Failed to cancel subscription');
						}
					};
				}}
			>
				<button class="btn btn-error w-full" disabled={loading}>Cancel Subscription</button>
			</form>
		{/if}
	{:else}
		<p class="text-center">You currently do not have a subscription.</p>
	{/if}
</div>
