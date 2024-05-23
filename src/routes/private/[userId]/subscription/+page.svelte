<script lang="ts">
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import { PUBLIC_STRIPE_CUSTOMER_PORTAL } from '$env/static/public';
	import { goto } from '$app/navigation';
	import PricingPlans from '$components/PricingPlans/PricingPlans.svelte';

	export let data;
	$: ({ session } = data);

	let updateModal: HTMLDialogElement;
	let cancelModal: HTMLDialogElement;
	let renewModal: HTMLDialogElement;

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

	const handleFormSubmit = ({}: {}) => {
		const toastId = toast.loading('Processing...');
		return async ({ result, update }: { result: any; update: () => void }) => {
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
			} finally {
				setTimeout(() => {
					// give the UI some time to update from the new stripe info
					updateModal.close();
					cancelModal.close();
					renewModal.close();
				}, 1000);
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

	function confirmUpdate() {
		updateModal.showModal();
	}

	function confirmCancel() {
		cancelModal.showModal();
	}

	function confirmRenew() {
		renewModal.showModal();
	}

	console.log(data);
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
			<button
				type="button"
				class="btn btn-primary w-full"
				on:click={confirmUpdate}
				disabled={newQuantity === data.subscription.items.data[0].quantity}>Update</button
			>
		</div>

		{#if !data.subscription.cancel_at_period_end}
			<button type="button" class="btn btn-error btn-outline w-full" on:click={confirmCancel}>
				Cancel Subscription
			</button>
		{:else}
			<button type="button" class="btn btn-success w-full" on:click={confirmRenew}
				>Renew Subscription</button
			>
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
</div>

<dialog class="modal p-0" bind:this={updateModal}>
	<form
		method="post"
		action="?/updateSubscription"
		use:enhance={handleFormSubmit}
		class="modal-box"
	>
		<h3 class="font-bold text-lg">Confirm Subscription Update</h3>
		<p class="py-4">
			The current price per listing is ${data.subscription.items.data[0].price.unit_amount / 100} USD
			per {data.subscription.plan.interval}.
		</p>
		<p class="py-4">
			{#if newQuantity > data.subscription.items.data[0].quantity}
				<span class="text-xl font-bold">Increase in Quantity</span>
				<br />
				You have increased the quantity. You will instantly have access to the new quantity, and Stripe
				will prorate the payment based on the added quantity and the remaining billing period.
				<br /><br />
				<span class="font-bold">Do you want to proceed?</span>
			{:else}
				<span class="text-xl font-bold">Decrease in Quantity</span>
				<br />
				You have decreased the quantity. The change will reflect instantly, and Stripe will adjust the
				payment based on the reduced quantity and the remaining billing period.
				<br /><br />
				<span class="font-bold">Do you want to proceed?</span>
			{/if}
		</p>

		<input type="hidden" name="newQuantity" value={newQuantity} />
		<div class="modal-action">
			<button type="button" class="btn" on:click={() => updateModal.close()}>Cancel</button>
			<button type="submit" class="btn btn-primary">Confirm</button>
		</div>
	</form>
</dialog>

<dialog class="modal" bind:this={cancelModal}>
	<form
		method="post"
		action="?/cancelSubscription"
		use:enhance={handleFormSubmit}
		class="modal-box"
	>
		<h3 class="font-bold text-lg">Confirm Cancellation</h3>
		<p class="py-4">Are you sure you want to cancel your subscription?</p>
		<div class="modal-action">
			<button type="button" class="btn" on:click={() => cancelModal.close()}>Cancel</button>
			<button type="submit" class="btn btn-error">Confirm</button>
		</div>
	</form>
</dialog>

<dialog class="modal" bind:this={renewModal}>
	<form method="post" action="?/renewSubscription" use:enhance={handleFormSubmit} class="modal-box">
		<h3 class="font-bold text-lg">Confirm Renewal</h3>
		<p class="py-4">
			The current price per listing is ${data.subscription.items.data[0].price.unit_amount / 100} USD
			per {data.subscription.plan.interval}.
		</p>
		<p class="py-4">
			<span class="text-xl font-bold">Renew Subscription</span>
			<br />
			You have selected to renew your subscription for {newQuantity} listings. By renewing your subscription,
			you will continue to have access to the service and will be billed ${(data.subscription.items
				.data[0].price.unit_amount /
				100) *
				newQuantity} USD {data.subscription.plan.interval} per day.
			<br /><br />
			<span class="font-bold">Do you want to proceed?</span>
		</p>

		<div class="modal-action">
			<button type="button" class="btn" on:click={() => renewModal.close()}>Cancel</button>
			<button type="submit" class="btn btn-success">Confirm</button>
		</div>
	</form>
</dialog>

<Toaster />
