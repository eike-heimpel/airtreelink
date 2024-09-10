<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import { PUBLIC_STRIPE_PRODUCT_ID } from '$env/static/public';

	export let supabaseSession: Session;
	export let showYearlyPrice = false;

	let basicQuantity = 1;
	function updateQuantity(plan: string, change: number) {
		if (plan === 'basic') {
			basicQuantity += change;
			if (basicQuantity < 1) basicQuantity = 1;
			if (basicQuantity > 5) basicQuantity = 5;
		}
	}

	async function handleBasicPlanPurchase() {
		const quantity = basicQuantity;
		if (!supabaseSession) {
			goto('/auth');
			return;
		}

		try {
			goto(
				`/api/stripe/checkout?price_id=${showYearlyPrice ? yearlyPlan.id : monthlyPlan.id}&quantity=${quantity}`
			);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	let monthlyPrice: number;
	let yearlyPrice: number;

	let monthlyPlan;
	let yearlyPlan;

	onMount(async () => {
		const response = await fetch(`/api/stripe/prices?product_id=${PUBLIC_STRIPE_PRODUCT_ID}`);

		if (!response.ok) {
			const { message } = await response.json();
			console.error('Error fetching prices:', message);
			return;
		}

		const { prices } = await response.json();

		monthlyPlan = prices.find((price) => price.interval === 'month');
		yearlyPlan = prices.find((price) => price.interval === 'year');

		if (monthlyPlan) {
			monthlyPrice = monthlyPlan.amount.includes('.00')
				? monthlyPlan.amount.split('.')[0]
				: monthlyPlan.amount;
		}

		if (yearlyPlan) {
			yearlyPrice = yearlyPlan.amount.includes('.00')
				? yearlyPlan.amount.split('.')[0]
				: yearlyPlan.amount;
		}
	});
</script>

<div class="card p-6 rounded-lg shadow-xl w-full max-w-sm flex flex-col justify-between">
	<div>
		<h2 class="text-2xl font-bold mb-4">Basic</h2>
		<div class="text-5xl font-bold mb-4 h-10">
			{#if monthlyPrice}
				${showYearlyPrice ? yearlyPrice : monthlyPrice}<span class="text-xl">/listing</span>
			{:else}
				<div class="skeleton h-full w-full"></div>
			{/if}
		</div>

		<ul class="mb-4 space-y-2">
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Host public URL with your listing
			</li>
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Unique private URL
			</li>
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Unlimited listing modifications
			</li>
		</ul>
		<p class="text-center mb-4 italic">
			Choose the number of listings you want to add. You can always add more later.
		</p>
		<div class="flex items-center justify-center space-x-2 mb-2">
			<button
				class="btn btn-primary"
				id="decreaseQuantity"
				on:click={() => updateQuantity('basic', -1)}
				class:disabled={basicQuantity === 1}
			>
				-
			</button>
			<div class="flex items-center justify-center">
				<input
					type="number"
					id="basicQuantity"
					class="input input-bordered w-20 text-center"
					value={basicQuantity}
					readonly
				/>
			</div>
			<button
				class="btn btn-primary"
				id="increaseQuantity"
				on:click={() => updateQuantity('basic', 1)}
				class:disabled={basicQuantity === 5}
			>
				+
			</button>
		</div>
		{#if basicQuantity >= 5}
			<p class="text-center text-sm text-gray-500 w-full break-words">
				Contact Support for more listings.
			</p>
		{/if}
	</div>
	<button class="btn btn-primary w-full mt-4" on:click={handleBasicPlanPurchase}
		>Get Basic Plan</button
	>
</div>
