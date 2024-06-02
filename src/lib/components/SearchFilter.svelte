<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { iconMapping } from '$lib/listings/cards/cardIconMappings';
	import type { ListingCard } from '$lib/types/cards';
	import Filter from 'virtual:icons/mdi/filter';

	export let cards: ListingCard[] = [];
	export let addIconFilter: boolean = false;

	let searchQuery = '';
	let selectedIcon: string | null = null;
	let filterDropdownOpen = false;
	const dispatch = createEventDispatcher();

	function filterCards() {
		let filteredCards = cards.filter((card) => {
			let lowerSearchQuery = searchQuery.toLowerCase();
			let matchesSearch =
				!searchQuery ||
				card.title.toLowerCase().includes(lowerSearchQuery) ||
				card.type?.toLowerCase().includes(lowerSearchQuery) ||
				JSON.stringify(card.content_fields).toLowerCase().includes(lowerSearchQuery);
			let matchesIcon = !selectedIcon || card.icon === selectedIcon;
			return matchesSearch && matchesIcon;
		});
		dispatch('filter', { filteredCards });
	}

	$: searchQuery, selectedIcon, filterCards();

	function handleIconFilter(key: string, iconName: string) {
		selectedIcon = key;
		searchQuery = iconName;
		filterDropdownOpen = false;
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
		on:input={filterCards}
	/>

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
