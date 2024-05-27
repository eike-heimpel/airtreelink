<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import HomeOutline from 'virtual:icons/mdi/home-outline';
	import InfoOutline from 'virtual:icons/mdi/information-outline';
	import StarOutline from 'virtual:icons/mdi/star-outline';
	import { goto } from '$app/navigation';

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

<div class="fixed bottom-0 w-full bg-base-200 border-t border-neutral flex justify-center">
	<ul class="flex w-full">
		<li class="flex-1">
			<button
				class="w-full py-2 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				'home'
					? 'bg-accent text-white'
					: 'hover:bg-accent hover:text-white'}"
				on:click={() => {
					activeTab = 'home';
					updateQueryParam('home');
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'home';
						updateQueryParam('home');
					}
				}}
				on:touchstart={() => {
					activeTab = 'home';
					updateQueryParam('home');
				}}
			>
				<HomeOutline class="w-6 h-6" />
				<span class="hidden md:block">Basic</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-2 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				'links'
					? 'bg-accent text-white'
					: 'hover:bg-accent hover:text-white'}"
				on:click={() => {
					activeTab = 'links';
					updateQueryParam('links');
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'links';
						updateQueryParam('links');
					}
				}}
				on:touchstart={() => {
					activeTab = 'links';
					updateQueryParam('links');
				}}
			>
				<InfoOutline class="w-6 h-6" />
				<span class="hidden md:block">House Info</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-2 flex flex-col items-center justify-center lg:text-lg {activeTab ===
				'recommendations'
					? 'bg-accent text-white'
					: 'hover:bg-accent hover:text-white'}"
				on:click={() => {
					activeTab = 'recommendations';
					updateQueryParam('recommendations');
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'recommendations';
						updateQueryParam('recommendations');
					}
				}}
				on:touchstart={() => {
					activeTab = 'recommendations';
					updateQueryParam('recommendations');
				}}
			>
				<StarOutline class="w-6 h-6" />
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
