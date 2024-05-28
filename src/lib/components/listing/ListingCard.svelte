<script lang="ts">
	import { onMount } from 'svelte';
	import { editMode } from '$lib/stores/store';
	import { toast } from 'svelte-french-toast';
	import { invalidateAll } from '$app/navigation';
	import { toastPromiseDelayMs } from '$lib/stores/store';
	import type { ContentField } from '$lib/types/fields';
	import type { Database } from '$lib/types/supabase';
	import Sortable from 'sortablejs';
	import DragIcon from 'virtual:icons/mdi/drag';

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
	let checked = false;

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

	onMount(() => {
		let sortable;
		if ($editMode) {
			sortable = new Sortable(document.getElementById('sortable-list'), {
				animation: 150,
				handle: '.drag-handle',
				onEnd: (event) => {
					const { oldIndex, newIndex } = event;
					if (oldIndex !== newIndex) {
						const movedItem = editedCard.content_fields.splice(oldIndex, 1)[0];
						editedCard.content_fields.splice(newIndex, 0, movedItem);
					}
				}
			});
		}
		return () => {
			if (sortable) sortable.destroy();
		};
	});
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

<div id="sortable-list" class="collapse-content flex flex-col gap-2">
	{#each editedCard.content_fields as field, index (field.id)}
		<div class="flex items-center">
			<div class="flex-grow">
				{#if field.type === 'text'}
					<TextFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
				{:else if field.type === 'video'}
					<VideoFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
				{:else if field.type === 'address'}
					<AddressFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
				{:else if field.type === 'link'}
					<LinkFieldComponent {field} on:updateField={(e) => updateField(index, e.detail)} />
				{/if}
			</div>
			{#if $editMode}
				<div class="drag-handle cursor-grab">
					<DragIcon />
				</div>
			{/if}
		</div>
	{/each}

	{#if $editMode}
		<div class="flex justify-end gap-4 p-4">
			<button class="btn btn-primary" on:click={saveEdit}>Save All</button>
		</div>
	{/if}
</div>
