<script lang="ts">
	import ListingTab from '$components/listing/ListingTab.svelte';
	import NavigationMenu from '$components/listing/NavigationMenu.svelte';
	import { previewMode } from '$lib/stores/store';
	import { page } from '$app/stores';
	import type { Database } from '$lib/types/supabase';
	import { ActiveTab } from '$lib/types/listing';
	import ArrivalTab from '$components/listing/ArrivalTab.svelte';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	type Listing = Database['public']['Tables']['Listings']['Row'];

	export let currentListing: Listing;

	let activeTab = 'arrival';
	let listingBackgroundImageUrl: string;

	$: listingBackgroundImageUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images/${currentListing.hash}/${currentListing.title_image_hash}.webp`;
</script>

{#if currentListing}
	<div class="relative w-full h-full min-h-screen">
		<div
			class="absolute inset-0 bg-cover bg-center bg-fixed -z-10"
			style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url({listingBackgroundImageUrl});"
		></div>

		<div
			class="flex flex-col h-full w-full px-4 pb-20 overflow-auto pt-20 {$previewMode
				? 'pt-10'
				: 'md:pt-10'}"
		>
			<div
				class="w-full flex justify-center items-center pb-4 {activeTab !== ActiveTab.Arrival
					? 'hidden md:flex'
					: 'flex'}"
			>
				<h1
					class="text-center text-2xl text-primary font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-10 shadow-md"
				>
					{currentListing.name}
				</h1>
			</div>

			<div class="text-center flex justify-center relative">
				{#if activeTab === ActiveTab.Recommendation}
					<ListingTab
						cards={Object.values(currentListing.cards).filter(
							(card) => card.type === ActiveTab.Recommendation
						)}
						type={ActiveTab.Recommendation}
					/>
				{:else if activeTab === ActiveTab.Home}
					<ListingTab
						cards={Object.values(currentListing.cards).filter(
							(card) => card.type === ActiveTab.Home
						)}
						type={ActiveTab.Home}
					/>
				{:else if activeTab === ActiveTab.Arrival}
					<ArrivalTab
						cards={Object.values(currentListing.cards).filter(
							(card) => card.type === ActiveTab.Arrival
						)}
					/>
				{/if}
			</div>
		</div>

		<NavigationMenu bind:activeTab />
	</div>
{/if}
