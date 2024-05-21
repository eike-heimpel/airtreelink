<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';

	export let supabaseSession: Session;

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
			goto(`/api/stripe/checkout?plan=basic&quantity=${quantity}`);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<!-- Basic Plan -->
<div class="card p-6 rounded-lg shadow-xl w-full max-w-sm flex flex-col justify-between">
	<div>
		<h2 class="text-2xl font-bold mb-4">Basic</h2>
		<div class="text-5xl font-bold mb-4">$1<span class="text-xl">/listing</span></div>
		<ul class="mb-4 space-y-2">
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Host public URL with your listing
			</li>
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Unique private URL
			</li>
			<li class="flex items-center">
				<span class="text-green-500 mr-2">✓</span>Unlimited modify listing info updates
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
