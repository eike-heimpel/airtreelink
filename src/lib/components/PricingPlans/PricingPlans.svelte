<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Session } from '@supabase/supabase-js';
	import BasePlan from './BasePlan.svelte';

	export let supabaseSession: Session;
</script>

<h1 class="text-4xl font-bold mb-10">Choose Your Plan</h1>
<p class="text-lg mb-10 text-center max-w-4xl">
	We currently offer the Simple Plan, which includes everything you need to get started. Stay tuned
	for our Premium Plan with additional features coming soon! Not sure yet? Pick 1 month and turn off
	auto renewal. See what your guests think and come back if you like it.
</p>
<div class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
	<BasePlan {supabaseSession} />
	<div
		class="card opacity-50 p-6 rounded-lg shadow-lg w-full max-w-sm relative flex flex-col justify-between"
	>
		<div>
			<h2 class="text-2xl font-bold mb-4">Premium</h2>
			<div class="text-5xl font-bold mb-4">$3<span class="text-xl">/listing</span></div>
			<ul class="mb-4 space-y-2">
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Everything in the Basic plan
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Generate multiple URLs per listing with
					different content
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Add a password to the public listing
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>URL hash and password rotation
				</li>
				<li class="flex items-center">
					<span class="text-green-500 mr-2">✓</span>Permission to add affiliate links to generate
					revenue
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
