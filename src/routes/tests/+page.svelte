<script>
	import { onMount } from 'svelte';

	export let data;

	let cards = {};
	let lastUpdated = '';

	onMount(() => {
		// Retrieve the last updated timestamp and cards from localStorage
		const storedLastUpdated = localStorage.getItem('lastUpdated');
		const storedCards = localStorage.getItem('cards');

		// Parse the stored cards if they exist, otherwise initialize as an empty object
		if (storedCards) {
			cards = JSON.parse(storedCards);
		}

		console.log('Stored cards:', cards);
		console.log('Stored lastUpdated:', storedLastUpdated);

		// Update cards with new data from the server
		const newCards = data.modifiedCards;

		for (const card of newCards) {
			cards[card.id] = card;
		}

		// Update the lastUpdated timestamp in localStorage
		localStorage.setItem('lastUpdated', data.lastChanged);

		// Save the updated cards back to localStorage
		localStorage.setItem('cards', JSON.stringify(cards));

		console.log('all ids: ', Object.keys(cards));
	});
</script>

<main>
	<h1>Listings</h1>
	<!-- {#each cards as card}
		<div class="card">
			<p>{card.content}</p>
		</div>
	{/each} -->
</main>

<style>
	.card {
		border: 1px solid #ccc;
		padding: 16px;
		margin: 8px 0;
	}
</style>
