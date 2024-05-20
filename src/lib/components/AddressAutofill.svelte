<!-- MapboxSearchAutocomplete.svelte -->
<script>
	import { PUBLIC_MAPBOX_ACCESS_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';

	let query = '';
	let suggestions = [];
	let selectedAddress = null;
	let sessionToken = uuidv4();

	async function searchAddress() {
		const accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;
		const language = 'en';
		const limit = 5;
		const proximity = '-83.748708,42.265837';
		const country = '';

		const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&language=${language}&limit=${limit}&session_token=${sessionToken}&proximity=${proximity}&country=${country}&access_token=${accessToken}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			suggestions = data.suggestions;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function retrieveDetails(suggestion) {
		const accessToken = PUBLIC_MAPBOX_ACCESS_TOKEN;
		const mapboxId = suggestion.mapbox_id;
		const language = 'en';
		const attributeSets = 'basic';

		const url = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}?language=${language}&attribute_sets=${attributeSets}&session_token=${sessionToken}&access_token=${accessToken}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			selectedAddress = data.features[0].properties.full_address;
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<div class="container mx-auto p-4">
	<h2 class="text-2xl font-bold mb-4">Search for an Address</h2>
	<div class="form-control">
		<input
			type="text"
			placeholder="Enter address"
			class="input input-bordered"
			bind:value={query}
			on:input={searchAddress}
		/>
	</div>

	{#if suggestions.length > 0}
		<div class="mt-4">
			<h3 class="text-lg font-bold mb-2">Suggestions:</h3>
			<ul class="menu bg-base-100 rounded-box">
				{#each suggestions as suggestion}
					<li>
						<a href="#" on:click|preventDefault={() => retrieveDetails(suggestion)}>
							<span class="font-bold">{suggestion.name}</span>
							<span class="text-sm">{suggestion.place_formatted}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if selectedAddress}
		<div class="mt-8">
			<h3 class="text-lg font-bold mb-2">Selected Address:</h3>
			<div class="bg-base-100 rounded-box p-4">
				<p>{selectedAddress}</p>
			</div>
		</div>
	{/if}
</div>
