<script lang="ts">
	import HomeOutline from 'virtual:icons/mdi/home-outline';
	import InfoOutline from 'virtual:icons/mdi/information-outline';
	import StarOutline from 'virtual:icons/mdi/star-outline';

	export let activeTab = 'recommendations';
</script>

<div class="fixed bottom-0 w-full bg-base-200 border-t border-neutral flex justify-center">
	<ul class="flex w-full">
		<li class="flex-1">
			<button
				class="w-full py-2 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				'getStarted'
					? 'bg-accent text-white'
					: 'hover:bg-accent hover:text-white'}"
				on:click={() => (activeTab = 'getStarted')}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'getStarted';
					}
				}}
				on:touchstart={() => (activeTab = 'getStarted')}
			>
				<HomeOutline class="w-6 h-6" />
				<span class="hidden md:block">Basics</span>
			</button>
		</li>
		<li class="flex-1">
			<button
				class="w-full py-2 flex flex-col items-center justify-center border-r border-neutral lg:text-lg {activeTab ===
				'links'
					? 'bg-accent text-white'
					: 'hover:bg-accent hover:text-white'}"
				on:click={() => (activeTab = 'links')}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'links';
					}
				}}
				on:touchstart={() => (activeTab = 'links')}
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
				on:click={() => (activeTab = 'recommendations')}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						activeTab = 'recommendations';
					}
				}}
				on:touchstart={() => (activeTab = 'recommendations')}
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
