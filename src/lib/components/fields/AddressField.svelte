<script lang="ts">
	import type { AddressField } from '$lib/types/fields';

	export let field: AddressField;

	// Provide default values if properties are undefined
	const showDirections = field.showDirections ?? true;
	const showAddressAsText = field.showAddressAsText ?? false;

	function openDirections(address: string) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

{#if showAddressAsText}
	<p class="mt-2 text-neutral">{field.content}</p>
{/if}

{#if showDirections}
	<address class="mt-2 not-italic text-secondary">
		<button class="btn btn-primary" on:click={() => openDirections(field.content)}>
			Get Directions
		</button>
	</address>
{/if}
