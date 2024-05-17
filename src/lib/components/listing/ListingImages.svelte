<script lang="ts">
	import { onMount } from 'svelte';

	let images: string[] = ['/placeholder1.webp', '/placeholder2.webp', '/placeholder3.webp'];

	let currentImageIndex: number = 0;

	// Swipe event handlers
	let startX: number;
	let endX: number;

	function touchStart(event: TouchEvent) {
		startX = event.touches[0].clientX;
	}

	function touchMove(event: TouchEvent) {
		endX = event.touches[0].clientX;
	}

	function touchEnd() {
		if (startX - endX > 50) {
			nextImage();
		} else if (endX - startX > 50) {
			prevImage();
		}
	}

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
	}
</script>

<div class="hidden md:grid grid-cols-3 gap-1 max-w-4xl mx-auto mt-8">
	<div class="md:col-span-2">
		<img src={images[0]} alt="Large Image" class="w-full h-auto" />
	</div>
	<div class="grid grid-rows-2 gap-1">
		<img src={images[1]} alt="Small Image" class="w-full h-auto cursor-pointer" />
		<img src={images[2]} alt="Small Image" class="w-full h-auto cursor-pointer" />
	</div>
</div>

<!-- Mobile slider -->
<div class="md:hidden relative max-w-4xl mx-auto mt-8">
	<img
		src={images[currentImageIndex]}
		alt="Slider Image"
		class="w-full h-auto"
		on:touchstart={touchStart}
		on:touchmove={touchMove}
		on:touchend={touchEnd}
	/>
	<div class="text-center mt-2">
		{#each images as _, index}
			<span
				class="inline-block w-2 h-2 mx-1 rounded-full {index === currentImageIndex
					? 'bg-gray-800'
					: 'bg-gray-400'}"
			></span>
		{/each}
	</div>
</div>
