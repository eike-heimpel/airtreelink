<script lang="ts">
	import ListingTab from '$components/listing/ListingTab.svelte';
	import NavigationMenu from '$components/listing/NavigationMenu.svelte';
	import { previewMode } from '$lib/stores/store';
	import { page } from '$app/stores';
	import type { Database } from '$lib/types/supabase';
	import { ActiveTab } from '$lib/types/listing';

	type Listing = Database['public']['Tables']['Listings']['Row'];

	export let currentListing: Listing;

	let activeTab = 'arrival';
</script>

{#if currentListing}
	<div class="w-full">
		<div
			class="absolute inset-0 bg-cover bg-fixed -z-10"
			style="background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url({currentListing.title_image_url});"
		></div>

		<div
			class="listing-info w-full px-4 pb-20 {$previewMode || $page.route.id?.includes('public')
				? 'pt-10'
				: 'pt-24'} mb-10"
		>
			<div
				class="w-full flex justify-center items-center pb-4 {activeTab !== ActiveTab.Arrival
					? 'hidden md:flex'
					: 'flex'}"
			>
				<h1
					class="text-center text-2xl font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-50"
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
				{:else if activeTab === 'arrival'}
					<ListingTab
						cards={Object.values(currentListing.cards).filter((card) => card.type === 'arrival')}
						type="arrival"
					/>
				{/if}
			</div>
		</div>

		<NavigationMenu bind:activeTab />
	</div>
{/if}

<style>
	.listing-info {
		display: grid;
		grid-template-rows: auto 1fr;
	}
</style>
