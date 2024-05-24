<script lang="ts">
	import { page } from '$app/stores';

	import ListingView from '$components/ListingView.svelte';
	import ListingSettings from '$components/listing/ListingSettings.svelte';

	export let data;

	let currentListing;

	$: currentListing = data.listings.find(
		(listing) => listing.id === parseInt($page.params.listingId)
	);
</script>

<ListingView {currentListing} />
<ListingSettings {currentListing} />
