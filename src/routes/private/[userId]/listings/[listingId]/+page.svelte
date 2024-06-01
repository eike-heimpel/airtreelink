<script lang="ts">
	import { onMount } from 'svelte';
	import ListingView from '$components/ListingView.svelte';
	import ListingSettings from '$components/listing/ListingSettings.svelte';
	import { toast } from 'svelte-french-toast';
	import { browser } from '$app/environment';
	import type { Database } from '$lib/types/supabase';

	type Listing = Database['public']['Tables']['Listings']['Row'];

	export let data;

	let currentListingInfo: Listing = data.currentListingInfo;
	let currentListing: Listing = JSON.parse(JSON.stringify(currentListingInfo));

	currentListing.cards = {};

	let updatedListing = {};

	function updateListing() {
		const storedListing = localStorage.getItem(data.currentListingInfo.hash);

		if (storedListing) {
			currentListing = JSON.parse(storedListing);
		}

		const newCards = data.modifiedCards;

		for (const card of newCards) {
			currentListing.cards[card.id] = card;
		}

		const allCardIds = data.allCardIds;

		for (const id of Object.keys(currentListing.cards)) {
			if (!allCardIds.includes(parseInt(id))) {
				const cardName = currentListing.cards[id].title;
				delete currentListing.cards[id];
				console.log('Deleted card:', id);
			}
		}

		localStorage.setItem('lastUpdated', data.lastChanged);

		localStorage.setItem(data.currentListingInfo.hash, JSON.stringify(currentListing));

		currentListing = { ...currentListing };
	}

	onMount(() => {
		updateListing();
	});

	$: if (data && browser) {
		updateListing();
	}

	$: updatedListing = currentListing;
</script>

<ListingView currentListing={updatedListing} />
<ListingSettings currentListing={updatedListing} />
