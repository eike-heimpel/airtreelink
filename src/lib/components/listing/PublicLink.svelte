<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll, invalidate } from '$app/navigation';

	export let isPublic: boolean;
	export let listingId: number;
	export let listingHash: string;

	function copyToClipboard() {
		const link = $page.url.host + '/public/listings/' + listingId + '?hash=' + listingHash;
		navigator.clipboard.writeText(link);
		toast.success('Link copied to clipboard!');
	}

	async function rotateUniqueHash() {
		try {
			const updateToast = toast.promise(
				fetch('/api/listing/change-hash', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ listingId })
				}),
				{
					loading: 'Updating url ...',
					success: 'Url updated successfully!',
					error: 'Failed to update hash'
				}
			);

			const response = await updateToast;

			if (!response.ok) {
				throw new Error('Failed to update hash');
			}

			const result = await response.json();
			invalidateAll();
		} catch (error) {
			console.error('Error updating hash:', error);
			toast.error('Error updating hash');
		}
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
		<button class="btn btn-sm btn-outline" on:click={rotateUniqueHash}>Change URL</button>
	</div>
{/if}
