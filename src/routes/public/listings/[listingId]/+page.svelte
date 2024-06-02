<script lang="ts">
	import ListingView from '$components/ListingView.svelte';

	import type { Database } from '$lib/types/supabase';

	type Listing = Database['public']['Tables']['Listings']['Row'];

	export let data;

	let currentListing: Listing = data.currentListingInfo;
	currentListing.cards = data.cards;
</script>

<ListingView {currentListing} />
