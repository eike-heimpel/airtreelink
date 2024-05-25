<script lang="ts">
	import type { Session } from '@supabase/supabase-js';
	import BasePlan from './BasePlan.svelte';

	export let supabaseSession: Session;
	export let noText = false;
	let showYearlyPrice = false;
</script>

{#if !noText}
	<h1 class="text-4xl font-bold">Choose Your Plan</h1>
	<p class="text-lg mb-10 text-center max-w-4xl">
		We currently offer the Simple Plan, which includes everything you need to get started.
	</p>
{/if}
<div class="flex justify-center items-center">
	<span class="mr-2">Monthly</span>
	<input type="checkbox" class="toggle toggle-primary" bind:checked={showYearlyPrice} />
	<span class="ml-2">Yearly</span>
</div>

<div class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
	<BasePlan {supabaseSession} {showYearlyPrice} />
	<div
		class="card opacity-50 p-6 rounded-lg shadow-lg w-full max-w-sm relative flex flex-col justify-between"
	>
		<div>
			<h2 class="text-2xl font-bold mb-4">Premium</h2>
			<div class="text-5xl font-bold mb-4 h-10"></div>
			<ul class="mb-4 space-y-2">
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Everything in the Basic plan
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Display recommendations on a map.
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Generate multiple URLs per listing with
					different content
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Add a password to the public listing
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Additional customization options
				</li>
			</ul>
		</div>
		<button class="btn btn-primary w-full opacity-50 cursor-not-allowed mt-4" disabled
			>Get Premium Plan</button
		>
		<div class="absolute top-2 right-2 bg-accent text-black px-2 py-1 rounded text-xs font-bold">
			Coming Soon
		</div>
	</div>
</div>
