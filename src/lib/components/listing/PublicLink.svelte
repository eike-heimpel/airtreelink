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

<div class="space-y-2">
	{#if isPublic}
		<div class="flex space-x-2">
			<a
				class="btn btn-sm btn-primary"
				href="/public/listings/{listingId}?hash={listingHash}"
				target="_blank">View</a
			>
			<button class="btn btn-sm btn-secondary" on:click={copyToClipboard}>Copy Link</button>
		</div>
	{/if}
</div>
