<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { AddressField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';

	export let field: AddressField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	let showDirections = field.showDirections ?? true;
	let showAddressAsText = field.showAddressAsText ?? false;

	const dispatch = createEventDispatcher();

	function updateContent(event) {
		dispatch('updateField', { key: 'content', value: event.target.value });
	}

	function updateShowAddressAsText(event) {
		dispatch('updateField', { key: 'showAddressAsText', value: event.target.checked });
	}

	function updateShowDirections(event) {
		dispatch('updateField', { key: 'showDirections', value: event.target.checked });
	}

	function openDirections(address: string) {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
		window.open(url, '_blank');
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Address Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		<input type="text" class="input input-primary" value={field.content} on:input={updateContent} />
		<div class="flex items-center mt-4 space-x-4">
			<label class="cursor-pointer flex items-center">
				<input
					type="checkbox"
					class="checkbox checkbox-primary mr-2"
					bind:checked={showAddressAsText}
					on:input={updateShowAddressAsText}
				/>
				<span class="label-text">Show address as text</span>
			</label>

			<label class="cursor-pointer flex items-center">
				<input
					type="checkbox"
					class="checkbox checkbox-primary mr-2"
					bind:checked={showDirections}
					on:input={updateShowDirections}
				/>
				<span class="label-text">Show directions button</span>
			</label>
		</div>
	</div>
	<div slot="preview">
		{#if showAddressAsText}
			<p class="mt-2 text-neutral">{field.content}</p>
		{/if}
		{#if showDirections}
			<address class="mt-2 not-italic">
				<button
					class="btn btn-sm btn-primary btn-outline"
					on:click={() => openDirections(field.content)}
				>
					Get Directions
				</button>
			</address>
		{/if}
	</div>
</BaseField>
