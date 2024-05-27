<script>
	import { onMount } from 'svelte';
	import ListingView from '$components/ListingView.svelte';
	import ListingSettings from '$components/listing/ListingSettings.svelte';
	import { page } from '$app/stores';

	export let data;

	let cards = {};
	let currentListing = data.currentListing;
	let listing = JSON.parse(JSON.stringify(currentListing));
	listing.cards = {};

	onMount(() => {
		// Retrieve the last updated timestamp and cards from localStorage
		const storedLastUpdated = localStorage.getItem('lastUpdated');
		const storedListing = localStorage.getItem(data.currentListing.hash);

		if (storedListing) {
			listing = JSON.parse(storedListing);
		}

		console.log('Stored cards:', listing.cards);
		console.log('Stored lastUpdated:', storedLastUpdated);

		// Update cards with new data from the server
		const newCards = data.modifiedCards;

		console.log('New cards:', Object.keys(newCards));

		for (const card of newCards) {
			listing.cards[card.id] = card;
		}

		// Update the lastUpdated timestamp in localStorage
		localStorage.setItem('lastUpdated', data.lastChanged);

		// Save the updated cards back to localStorage
		localStorage.setItem(data.currentListing.hash, JSON.stringify(listing));

		console.log('all ids: ', Object.keys(listing.cards));

		console.log('listing: ', listing);
	});
</script>

<ListingView {currentListing} />
<ListingSettings {currentListing} />
