<script lang="ts">
	import Links from '$components/listing/Links.svelte';
	import Recommendations from '$components/listing/Recommendations.svelte';
	import NavigationMenu from '$components/listing/NavigationMenu.svelte';
	import BasicInfo from '$components/listing/BasicInfo.svelte';
	import { previewMode } from '$lib/stores/store';

	export let currentListing;

	let activeTab = '';
</script>

<div
	class="hero min-h-screen w-full"
	style="background-image: url({currentListing.title_image_url});"
>
	<div class="hero-overlay bg-opacity-60"></div>

	<div class="h-full listing-info w-full px-4 pb-20 md:pt-4 {$previewMode ? 'pt-4' : 'pt-20'}">
		<div class="w-full flex justify-center items-center pb-4">
			<h1
				class="text-center text-2xl font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-50"
			>
				{currentListing.name}
			</h1>
		</div>

		<div class="text-center flex items-center justify-center">
			{#if activeTab === 'recommendations'}
				<Recommendations />
			{:else if activeTab === 'links'}
				<Links />
			{:else if activeTab === 'getStarted'}
				<BasicInfo />
			{/if}
		</div>
	</div>

	<NavigationMenu bind:activeTab />
</div>

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
