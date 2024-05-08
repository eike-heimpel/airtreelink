<script>
	import { goto } from '$app/navigation';
	export let data;
</script>

<div class="min-h-screen bg-gray-50 flex flex-wrap gap-10 items-center justify-center p-4">
	{#each data.listings as listing}
		<div
			class="card w-full max-w-lg bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out relative"
		>
			<figure class="overflow-hidden relative">
				{#if listing.public}
					<div class="badge badge-primary absolute top-2 right-2">Public</div>
				{/if}
				<img
					src={listing.title_image_url}
					alt="Beautiful Cabin By the Sea"
					class="transition-transform duration-300 ease-in-out hover:scale-105"
				/>
			</figure>
			<button
				class="card-body"
				on:click={() => goto(`listings/${listing.id}`)}
				on:keydown={(event) => {
					if (event.key === 'Enter') goto('listings/example');
				}}
			>
				<h2 class="card-title">{listing.name}</h2>
				<p>{listing.description}</p>
			</button>
		</div>
	{/each}
</div>
