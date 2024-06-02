<script lang="ts">
	import { onMount } from 'svelte';
	import ListingView from '$components/ListingView.svelte';
	import ListingSettings from '$components/listing/ListingSettings.svelte';
	import { toast } from 'svelte-french-toast';
	import { browser } from '$app/environment';
	import type { Database } from '$lib/types/supabase';

	type Listing = Database['public']['Tables']['Listings']['Row'];

	export let data;

	let currentListing: Listing = data.currentListingInfo;
	currentListing.cards = data.cards;
</script>

<ListingView {currentListing} />
