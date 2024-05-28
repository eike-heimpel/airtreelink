<script lang="ts">
	import { editMode } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import type { ContentField } from '$lib/types/fields';
	import type { Database } from '$lib/types/supabase';

	import TextFieldComponent from '$components/listing/cards/fields/TextField.svelte';
	import VideoFieldComponent from '$components/listing/cards/fields/VideoField.svelte';
	import AddressFieldComponent from '$components/listing/cards/fields/AddressField.svelte';
	import LinkFieldComponent from '$components/listing/cards/fields/LinkField.svelte';
	import Title from '$components/listing/cards/Title.svelte';

	type ListingCard = Omit<
		Database['public']['Tables']['listing_cards']['Row'],
		'content_fields'
	> & {
		content_fields: ContentField[];
	};

	export let card: ListingCard;

	let formLoading = false;
	let editedCard: ListingCard = { ...card };

	function updateField(index: number, eventDetail) {
		editedCard.content_fields[index][eventDetail.key] = eventDetail.value;
	}

	async function saveEdit() {
		editedCard.last_changed = new Date().toISOString();
		const toastId = toast.loading('Updating card...');

		const resp = await fetch('/api/listing/card', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ card: editedCard })
		});

		if (!resp.ok) {
			console.error('Error updating card:', resp.statusText);
			toast.error('Error updating card.', { id: toastId });
			return;
		}

		setTimeout(() => {
			toast.success('Card updated.', { id: toastId });
		}, $toastPromiseDelayMs);

		invalidateAll();
		$editMode = false;
	}

	let checked = false;
</script>

<input
	type="radio"
	name="my-accordion-1"
	{checked}
	on:click={() => {
		console.log('checked');
		checked = !checked;
	}}
/>

<div class="collapse-title">
	<Title bind:title={editedCard.title} />
</div>

<div class="collapse-content flex flex-col gap-2">
	{#each editedCard.content_fields as field, index}
		{#if field.type === 'text'}
			<TextFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
		{:else if field.type === 'video'}
			<VideoFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
		{:else if field.type === 'address'}
			<AddressFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
		{:else if field.type === 'link'}
			<LinkFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
		{/if}
	{/each}

	{#if $editMode}
		<div class="flex justify-end gap-4 p-4">
			<button class="btn btn-primary" on:click={saveEdit}>Save All</button>
		</div>
	{/if}
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.line-clamp-4 {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
