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
	import { createEventDispatcher } from 'svelte';
	import { nanoid } from 'nanoid';
	import type { FieldTypes } from '$lib/types/fields';
	import { fade } from 'svelte/transition';

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

	let editedCard: ListingCard = { ...card };
	let checked = false;
	let addingOtherField = false;

	function resetEditedCard(_) {
		editedCard = { ...card };
	}

	$: resetEditedCard(card); // needed for reactivity if the card changes from load function

	function updateField(index: number, eventDetail) {
		editedCard.content_fields[index][eventDetail.key] = eventDetail.value;
	}

	function addField(type: any) {
		const newField: ContentField = {
			id: nanoid(10), // Generates a shorter ID
			type,
			content: ''
		};
		editedCard.content_fields.push(newField);
		editedCard = { ...editedCard };
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

	function deleteField(fieldId: string) {
		editedCard.content_fields = editedCard.content_fields.filter((f) => f.id !== fieldId);
	}

	let sortable;

	onMount(() => {
		sortable = new Sortable(document.getElementById('sortable-list'), {
			disabled: !$editMode,

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
	});

	function updateSortable(editMode: any) {
		if (sortable) sortable.options.disabled = !editMode;
	}

	$: updateSortable($editMode);
</script>

<input
	type="radio"
	name="my-accordion-1"
	{checked}
	on:click={() => {
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
				<div class="flex items-center gap-2">
					<div class="drag-handle cursor-grab">
						<DragIcon />
					</div>
					<button class="btn btn-error btn-outline btn-sm" on:click={() => deleteField(field.id)}>
						X
					</button>
				</div>
			{/if}
		</div>
	{/each}

	{#if $editMode}
		<div class="flex justify-between gap-4 p-4">
			{#if addingOtherField}
				<button
					class="btn btn-outline btn-primary"
					on:click={() => {
						addingOtherField = false;
					}}
				>
					&lt;
				</button>

				<button class="btn btn-outline" on:click={() => addField('link')}>Link Field</button>
				<button class="btn btn-outline" on:click={() => addField('address')}>Address Field</button>
				<button class="btn btn-outline" on:click={() => addField('video')}>Video Field</button>
			{:else}
				<button class="btn btn-outline" on:click={() => addField('text')}>Add Text Field</button>
				<button
					class="btn btn-outline"
					on:click={() => {
						addingOtherField = true;
					}}>Add Other Field</button
				>
			{/if}
			<button class="btn btn-primary" on:click={saveEdit}>Save All</button>
		</div>
	{/if}
</div>
