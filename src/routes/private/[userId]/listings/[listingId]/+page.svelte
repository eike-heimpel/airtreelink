<script>
	import { onMount } from 'svelte';
	import ListingView from '$components/ListingView.svelte';
	import ListingSettings from '$components/listing/ListingSettings.svelte';
	import { page } from '$app/stores';

	export let data;

	let cards = {};
	let currentListingInfo = data.currentListingInfo;
	let currentListing = JSON.parse(JSON.stringify(currentListingInfo));
	currentListing.cards = {};

	let updatedListing = {};

	onMount(() => {
		// Retrieve the last updated timestamp and cards from localStorage
		const storedLastUpdated = localStorage.getItem('lastUpdated');
		const storedListing = localStorage.getItem(data.currentListingInfo.hash);

		if (storedListing) {
			currentListing = JSON.parse(storedListing);
		}

		console.log('Stored cards:', currentListing.cards);
		console.log('Stored lastUpdated:', storedLastUpdated);

		// Update cards with new data from the server
		const newCards = data.modifiedCards;

		console.log('New cards:', Object.keys(newCards));

		for (const card of newCards) {
			currentListing.cards[card.id] = card;
		}

		// Update the lastUpdated timestamp in localStorage
		localStorage.setItem('lastUpdated', data.lastChanged);

		// Save the updated cards back to localStorage
		localStorage.setItem(data.currentListingInfo.hash, JSON.stringify(currentListing));

		console.log('all ids: ', Object.keys(currentListing.cards));

		console.log('listing: ', currentListing);
	});

	$: updatedListing = currentListing;
</script>

<ListingView currentListing={updatedListing} />
<ListingSettings currentListing={updatedListing} />
