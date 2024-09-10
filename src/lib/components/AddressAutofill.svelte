<!-- MapboxSearchAutocomplete.svelte -->
<script>
	import { v4 as uuidv4 } from 'uuid';

	let query = '';
	let suggestions = [];
	let selectedAddress = null;
	let sessionToken = uuidv4();

	const PUBLIC_MAPBOX_ACCESS_TOKEN = '';

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

<div class="container mx-auto p-2 sm:p-4">
	<h2 class="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Search for an Address</h2>
	<div class="form-control">
		<input
			type="text"
			placeholder="Enter address"
			class="input input-bordered w-full sm:max-w-lg"
			bind:value={query}
			on:input={searchAddress}
		/>
	</div>

	{#if suggestions.length > 0}
		<div class="mt-2 sm:mt-4">
			<h3 class="text-md sm:text-lg font-bold mb-1 sm:mb-2">Suggestions:</h3>
			<ul class="menu bg-base-100 rounded-box max-h-64 overflow-y-auto">
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
		<div class="mt-4 sm:mt-8">
			<h3 class="text-md sm:text-lg font-bold mb-1 sm:mb-2">Selected Address:</h3>
			<div class="bg-base-100 rounded-box p-2 sm:p-4">
				<p>{selectedAddress}</p>
			</div>
		</div>
	{/if}
</div>
