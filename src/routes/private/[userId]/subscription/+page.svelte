<script lang="ts">
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import { PUBLIC_STRIPE_CUSTOMER_PORTAL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import PricingPlans from '$components/PricingPlans/PricingPlans.svelte';

	export let data;
	$: ({ session } = data);

	let newQuantity = data.subscription?.items.data[0].quantity || 1;
	let basicQuantity = 1;
	let loading = false;

	function updateQuantity(type: string, change: number) {
		if (type === 'subscription') {
			if (newQuantity + change >= 1) {
				newQuantity += change;
			}
		} else if (type === 'basic') {
			if (basicQuantity + change >= 1) {
				basicQuantity += change;
			}
		}
	}

	const handleFormSubmit = ({ formElement, formData, action, cancel, submitter }) => {
		const toastId = toast.loading('Processing...');
		return async ({ result, update }) => {
			try {
				const response = await result;
				if (response.type === 'success') {
					toast.success('Operation successful!', { id: toastId });
				} else {
					toast.error('Operation failed!', { id: toastId });
				}
				update();
			} catch (error) {
				toast.error('Operation failed!', { id: toastId });
			}
		};
	};

	async function handleBasicPlanPurchase() {
		if (!session) {
			goto('/auth');
			return;
		}
		try {
			goto(`/api/stripe/checkout?plan=basic&quantity=${basicQuantity}`);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<div class="w-fit mx-auto mt-10 p-6 bg-base-100 shadow-md rounded-lg">
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
					on:click={() => updateQuantity('subscription', -1)}
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
				<button
					class="btn btn-primary"
					id="increaseQuantity"
					on:click={() => updateQuantity('subscription', 1)}
				>
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
			<form method="post" action="?/renewSubscription" use:enhance={handleFormSubmit}>
				<button class="btn btn-success w-full" disabled={loading}>Renew Subscription</button>
			</form>
		{/if}
		<div class="mt-6 text-center text-sm italic">
			We use Stripe to handle subscriptions. You can also manage your subscription from your
			<a
				href={PUBLIC_STRIPE_CUSTOMER_PORTAL}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary"
			>
				Stripe Dashboard
			</a>
		</div>
	{:else}
		<p class="text-center text-lg mb-4">
			You currently do not have a subscription. Check out the options below:
		</p>
		<div class="flex flex-col items-center justify-center mt-6 w-full">
			<PricingPlans supabaseSession={session} />
		</div>
		<div class="mt-6 text-center italic text-sm">
			We use Stripe to handle subscriptions. If you think you should have a subscription, please try
			directly on the
			<a
				href={PUBLIC_STRIPE_CUSTOMER_PORTAL}
				target="_blank"
				rel="noopener noreferrer"
				class="text-primary"
			>
				Stripe Dashboard.
			</a> If you still have issues, please contact support.
		</div>
	{/if}
	<Toaster />
</div>
