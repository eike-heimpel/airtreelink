<script lang="ts">
	export let isPublic: boolean;
	export let listingId: number;
	export let listingHash: string;

	function copyToClipboard() {
		const link = `/public/listings/${listingId}?hash=${listingHash}`;
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!');
	}
</script>

{#if isPublic}
	<div class="flex space-x-2 justify-center">
		<a
			class="btn btn-sm btn-outline"
			href="/public/listings/{listingId}?hash={listingHash}"
			target="_blank">View Listing</a
		>
		<button class="btn btn-sm btn-outline" on:click={copyToClipboard}>Copy Link</button>
	</div>
{/if}
