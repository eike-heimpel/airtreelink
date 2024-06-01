<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import HomeOutline from 'virtual:icons/mdi/home-outline';
	import InfoOutline from 'virtual:icons/mdi/information-outline';
	import StarOutline from 'virtual:icons/mdi/star-outline';
	import { goto } from '$app/navigation';
	import { previewMode } from '$lib/stores/store';

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
				'home'
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
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
				<HomeOutline class="w-7 h-7" />
				<span class="hidden md:block">Home</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-3 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				'info'
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
				on:click={() => {
					activeTab = 'info';
					updateQueryParam('info');
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'info';
						updateQueryParam('info');
					}
				}}
				on:touchstart={() => {
					activeTab = 'info';
					updateQueryParam('info');
				}}
			>
				<InfoOutline class="w-7 h-7" />
				<span class="hidden md:block">House Info</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-3 flex flex-col items-center justify-center lg:text-lg {activeTab ===
				'recommendation'
					? 'bg-accent text-white'
					: 'hover:text-accent'}"
				on:click={() => {
					activeTab = 'recommendation';
					updateQueryParam('recommendation');
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'recommendation';
						updateQueryParam('recommendation');
					}
				}}
				on:touchstart={() => {
					activeTab = 'recommendation';
					updateQueryParam('recommendation');
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
