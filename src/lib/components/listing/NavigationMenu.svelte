<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import HomeOutline from 'virtual:icons/mdi/home-outline';
	import Directions from 'virtual:icons/mdi/directions';
	import StarOutline from 'virtual:icons/mdi/star-outline';
	import { goto } from '$app/navigation';
	import { previewMode } from '$lib/stores/store';
	import { ActiveTab } from '$lib/types/listing';

	export let activeTab = '';

	const queryPage = get(page).url.searchParams.get('page');
	if (queryPage) {
		activeTab = queryPage;
	}

	function updateQueryParam(tab: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('page', tab);
		goto(url.toString(), { replaceState: true });
	}
</script>

<div
	class="fixed bottom-0 w-full bg-base-200 border-t border-neutral flex justify-center z-10 {$previewMode
		? 'bg-opacity-90'
		: ''}"
>
	<ul class="flex w-full">
		<li class="flex-1">
			<button
				class="w-full py-3 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				ActiveTab.Arrival
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
				on:click={() => {
					activeTab = ActiveTab.Arrival;
					updateQueryParam(ActiveTab.Arrival);
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = ActiveTab.Arrival;
						updateQueryParam(ActiveTab.Arrival);
					}
				}}
				on:touchstart={() => {
					activeTab = ActiveTab.Arrival;
					updateQueryParam(ActiveTab.Arrival);
				}}
			>
				<Directions class="w-7 h-7" />
				<span class="hidden md:block">Arrival</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-3 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				ActiveTab.Home
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
				on:click={() => {
					activeTab = ActiveTab.Home;
					updateQueryParam(ActiveTab.Home);
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = ActiveTab.Home;
						updateQueryParam(ActiveTab.Home);
					}
				}}
				on:touchstart={() => {
					activeTab = ActiveTab.Home;
					updateQueryParam(ActiveTab.Home);
				}}
			>
				<HomeOutline class="w-7 h-7" />
				<span class="hidden md:block">House Info</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-3 flex flex-col items-center justify-center lg:text-lg {activeTab ===
				ActiveTab.Recommendation
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
				on:click={() => {
					activeTab = ActiveTab.Recommendation;
					updateQueryParam(ActiveTab.Recommendation);
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = ActiveTab.Recommendation;
						updateQueryParam(ActiveTab.Recommendation);
					}
				}}
				on:touchstart={() => {
					activeTab = ActiveTab.Recommendation;
					updateQueryParam(ActiveTab.Recommendation);
				}}
			>
				<StarOutline class="w-7 h-7" />
				<span class="hidden md:block">Recs</span>
			</button>
		</li>
	</ul>
</div>

<style>
	.button-active {
		background-color: var(--accent);
		color: white;
	}
	.button-hover:hover {
		background-color: var(--accent);
		color: white;
	}
</style>
