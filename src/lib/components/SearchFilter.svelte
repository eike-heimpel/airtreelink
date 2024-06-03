<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { iconMapping } from '$lib/listings/cards/cardIconMappings';
	import type { ListingCard } from '$lib/types/cards';
	import Filter from 'virtual:icons/mdi/filter';
	import Close from 'virtual:icons/mdi/close'; // Import an 'x' icon
	import MiniSearch from 'minisearch';

	export let cards: ListingCard[] = [];
	export let addIconFilter: boolean = false;

	let searchQuery = '';
	let selectedIcon: string | null = null;
	let filterDropdownOpen = false;
	const dispatch = createEventDispatcher();

	let miniSearch: MiniSearch;

	onMount(() => {
		miniSearch = new MiniSearch({
			fields: ['title', 'type', 'icon', 'content_fields'], // fields to index for full-text search
			storeFields: ['id'] // fields to return with search results
		});
		indexCards();
		filterCards(); // Ensure initial filtering is done after indexing
	});

	function indexCards() {
		if (miniSearch && cards.length > 0) {
			miniSearch.addAll(
				cards.map((card) => ({
					...card,
					content_fields: JSON.stringify(card.content_fields)
				}))
			);
		}
	}

	function filterCards() {
		if (!miniSearch) return; // Ensure miniSearch is initialized
		let results = miniSearch.search(searchQuery, {
			prefix: true,
			fuzzy: 0.2 // Reduce the fuzzy tolerance to prevent unrelated matches
		});
		let resultIds = results.map((result) => result.id);
		let filteredCards = cards.filter((card) => {
			let matchesSearch = !searchQuery || resultIds.includes(card.id);
			let matchesIcon = !selectedIcon || card.icon === selectedIcon;
			return matchesSearch && matchesIcon;
		});
		dispatch('filter', { filteredCards });
	}

	$: searchQuery,
		selectedIcon,
		() => {
			if (miniSearch) filterCards();
		};

	function handleIconFilter(key: string, iconName: string) {
		selectedIcon = key;
		searchQuery = iconName;
		filterDropdownOpen = false;
		filterCards();
	}

	function clearSearch() {
		searchQuery = '';
		filterCards();
	}
</script>

<div class="relative w-full">
	<input
		type="text"
		placeholder="Search..."
		class="input input-bordered w-full"
		class:pr-16={addIconFilter}
		bind:value={searchQuery}
		on:input={() => miniSearch && filterCards()}
	/>
	{#if searchQuery}
		<button
			class="absolute {addIconFilter ? 'right-16' : 'right-6'} top-0 z-10 h-full opacity-70"
			on:click={clearSearch}>X</button
		>
	{/if}
	{#if addIconFilter}
		<div class="absolute top-0 right-0 h-full">
			<details class="dropdown dropdown-end" bind:open={filterDropdownOpen}>
				<summary class="btn btn-outline btn-square h-full w-12 flex justify-center items-center">
					<Filter class="w-6 h-6" />
				</summary>
				<ul
					class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 border border-neutral"
				>
					{#each Object.entries(iconMapping) as [key, icon]}
						{#if icon.filterBy}
							<li>
								<button
									on:click={() => handleIconFilter(key, icon.name)}
									class="flex items-center gap-2 p-2 hover:bg-base-200 rounded"
								>
									<svelte:component this={icon.component} class="w-5 h-5" />
									<span>{icon.name}</span>
								</button>
							</li>
						{/if}
					{/each}
				</ul>
			</details>
		</div>
	{/if}
</div>
