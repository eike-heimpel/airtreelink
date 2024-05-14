<script lang="ts">
	export let data;

	console.log(data);
	// Placeholder functions for Stripe integration
	function handleBasicPlanPurchase() {
		// Implement Stripe integration for the basic plan
		console.log('Purchasing basic plan...');
	}

	function handlePremiumPlanPurchase() {
		// Implement Stripe integration for the premium plan
		console.log('Purchasing premium plan...');
	}
</script>

<div
	class="min-h-screen bg-neutral flex flex-col items-center justify-center p-4 space-y-8 text-white"
>
	<h1 class="text-4xl font-bold mb-10">Choose Your Plan</h1>
	<p class="text-lg mb-10 text-center">
		We currently offer the Simple Plan, which includes everything you need to get started. Stay
		tuned for our Premium Plan with additional features coming soon!
	</p>
	<div class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
		<!-- Basic Plan -->
		<div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col justify-between">
			<div>
				<h2 class="text-2xl font-bold mb-4">Basic</h2>
				<div class="text-5xl font-bold mb-4">$1<span class="text-xl">/listing</span></div>
				<ul class="mb-4 space-y-2">
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Host public URL with your listing
					</li>
					<li class="flex items-center"><span class="plan-icon">✓</span>Unique private URL</li>
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Unlimited modify listing info updates
					</li>
				</ul>
			</div>
			<button class="btn btn-primary w-full mt-4" on:click={handleBasicPlanPurchase}
				>Get Basic Plan</button
			>
		</div>

		<!-- Premium Plan -->
		<div
			class="bg-gray-800 opacity-50 p-6 rounded-lg shadow-lg w-full max-w-sm coming-soon flex flex-col justify-between"
		>
			<div>
				<h2 class="text-2xl font-bold mb-4">Premium</h2>
				<div class="text-5xl font-bold mb-4">$3<span class="text-xl">/listing</span></div>
				<ul class="mb-4 space-y-2">
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Everything in the Basic plan
					</li>
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Generate multiple URLs per listing with different
						content
					</li>
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Add a password to the public listing
					</li>
					<li class="flex items-center">
						<span class="plan-icon">✓</span>URL hash and password rotation
					</li>
					<li class="flex items-center">
						<span class="plan-icon">✓</span>Permission to add affiliate links to generate revenue
					</li>
				</ul>
			</div>
			<button class="btn btn-primary w-full opacity-50 cursor-not-allowed mt-4" disabled
				>Get Premium Plan</button
			>
		</div>
	</div>
</div>

<style>
	.coming-soon {
		position: relative;
	}

	.coming-soon::after {
		content: 'Coming Soon';
		position: absolute;
		top: 10px;
		right: 10px;
		color: #000;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: bold;
		@apply bg-accent;
	}

	.plan-icon {
		color: #4ade80;
		margin-right: 0.5rem;
	}
</style>
