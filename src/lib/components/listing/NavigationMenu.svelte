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

	const tabs = [
		{
			label: 'Arrival',
			value: ActiveTab.Arrival,
			icon: Directions
		},
		{
			label: 'House Info',
			value: ActiveTab.Home,
			icon: HomeOutline
		},
		{
			label: 'Recs',
			value: ActiveTab.Recommendation,
			icon: StarOutline
		}
	];
</script>

<div class="fixed bottom-0 w-full flex justify-center z-10">
	<ul
		class="flex w-full {$previewMode ? 'lg:gap-4' : 'md:gap-4'}  {$previewMode
			? 'lg:w-1/2'
			: 'md:w-1/2 md:mr-48'}"
	>
		{#each tabs as tab}
			<li class="flex-1">
				<button
					aria-label={tab.label}
					class="{!$previewMode
						? 'md:rounded-t-lg'
						: ''} w-full py-3 flex flex-col items-center justify-center {activeTab ===
					ActiveTab.Arrival
						? 'bg-opacity-75'
						: 'bg-opacity-95'} border-r border-neutral lg:text-lg {activeTab === tab.value
						? 'bg-accent text-white'
						: 'bg-base-200 hover:text-accent'}"
					on:click={() => {
						activeTab = tab.value;
						updateQueryParam(tab.value);
					}}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							activeTab = tab.value;
							updateQueryParam(tab.value);
						}
					}}
					on:touchstart={() => {
						activeTab = tab.value;
						updateQueryParam(tab.value);
					}}
				>
					<svelte:component this={tab.icon} class="w-7 h-7" />
					<span class="hidden md:block">{tab.label}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>
