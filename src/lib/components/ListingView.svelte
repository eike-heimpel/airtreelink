<script lang="ts">
	import Links from '$components/listing/Links.svelte';
	import Recommendations from '$components/listing/Recommendations.svelte';

	export let currentListing;

	let activeTab = 'recommendations';
</script>

<div
	class="hero min-h-screen w-full"
	style="background-image: url({currentListing.title_image_url});"
>
	<div class="hero-overlay bg-opacity-60"></div>

	<div class="h-full text-center">
		<div class="">
			<h1
				class="my-4 text-2xl font-bold inline-block bg-base-100 rounded-lg px-4 py-2 bg-opacity-50"
			>
				{currentListing.name}
			</h1>
			<div class="">
				{#if activeTab === 'recommendations'}
					<Recommendations />
				{:else if activeTab === 'links'}
					<Links />
				{:else if activeTab === 'getStarted'}
					<p>Get Started content goes here.</p>
				{/if}
			</div>
		</div>
	</div>
	<div class="fixed bottom-0 bg-base-100 border-t border-neutral flex justify-center">
		<ul class="menu menu-horizontal justify-around md:gap-10">
			<li>
				<button
					class="lg:text-2xl {activeTab === 'getStarted' ? 'active' : ''}"
					on:click={() => (activeTab = 'getStarted')}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							activeTab = 'getStarted';
						}
					}}
				>
					Basics
				</button>
			</li>
			<li>
				<button
					class="lg:text-2xl {activeTab === 'links' ? 'active' : ''}"
					on:click={() => (activeTab = 'links')}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							activeTab = 'links';
						}
					}}
				>
					House Info
				</button>
			</li>
			<li>
				<button
					class="lg:text-2xl {activeTab === 'recommendations' ? 'active' : ''}"
					on:click={() => (activeTab = 'recommendations')}
					on:keydown={(event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							activeTab = 'recommendations';
						}
					}}
				>
					Recommendations
				</button>
			</li>
		</ul>
	</div>
</div>

<style>
	.hero {
		background-size: cover;
		background-position: center;
	}
	.hero-overlay {
		background-color: rgba(0, 0, 0, 0.6);
	}
</style>
