<script>
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	let query = '';
	let suggestions = [];
	let selectedAddress = null;
	let autocompleteService;
	let placeService;

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = initServices;
		document.head.appendChild(script);
	});

	function initServices() {
		autocompleteService = new google.maps.places.AutocompleteService();
		placeService = new google.maps.places.PlacesService(document.createElement('div'));
	}

	function searchAddress() {
		if (query.length > 0) {
			const request = {
				input: query,
				language: 'en',
				types: ['address']
			};
			autocompleteService.getPlacePredictions(request, (predictions, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					suggestions = predictions.map((prediction) => ({
						place_id: prediction.place_id,
						description: prediction.description
					}));
				} else {
					suggestions = [];
				}
			});
		} else {
			suggestions = [];
		}
	}

	async function retrieveDetails(suggestion) {
		placeService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				selectedAddress = place.formatted_address;
			}
		});
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
							<span class="font-bold">{suggestion.description}</span>
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

<style>
	/* Custom styles here */
</style>
