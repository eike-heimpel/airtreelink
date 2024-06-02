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
	<div
		class="hero min-h-screen w-full"
		style="background-image: url({currentListing.title_image_url});"
	>
		<div class="hero-overlay bg-opacity-60"></div>

		<div
			class="h-full listing-info w-full px-4 pb-20 {$previewMode ||
			$page.route.id?.includes('public')
				? 'pt-10'
				: 'pt-24'} mb-10"
		>
			<div
				class="w-full flex justify-center items-center pb-4"
				class:hidden={activeTab !== ActiveTab.Arrival}
			>
				<h1
					class="text-center text-2xl font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-50"
				>
					{currentListing.name}
				</h1>
			</div>

			<div class="text-center flex justify-center">
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
		grid-template-rows: 70px 1fr;
	}
	.hero {
		background-size: cover;
		background-position: center;
	}
	.hero-overlay {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
