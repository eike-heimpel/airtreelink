<script lang="ts">
	let images: string[] = [
		'https://via.placeholder.com/600x400?text=Image+1',
		'https://via.placeholder.com/300x200?text=Image+3',
		'https://via.placeholder.com/300x200?text=Image+3'
	];
</script>

<div class="grid grid-cols-3 gap-1 max-w-4xl mx-auto mt-8">
	<div class="col-span-2">
		<img src={images[0]} alt="Large Image" class="h-full h-auto" />
	</div>
	<div class="grid grid-rows-2 gap-1">
		<img src={images[1]} alt="Small Image" class="w-full h-auto" />
		<img src={images[2]} alt="Small Image" class="w-full h-auto" />
	</div>
</div>
