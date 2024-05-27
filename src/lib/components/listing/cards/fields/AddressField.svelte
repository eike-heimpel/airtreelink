<script lang="ts">
	import type { AddressField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';
	import { createEventDispatcher } from 'svelte';

	export let field: AddressField;

	let showDirections = field.showDirections ?? true;
	let showAddressAsText = field.showAddressAsText ?? false;

	$: showDirections = field.showDirections ?? true;
	$: showAddressAsText = field.showAddressAsText ?? false;

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

{#if $editMode}
	<div class="form-control">
		<label class="label">
			<span class="label-text">Address</span>
		</label>
		<input
			type="text"
			class="input input-bordered"
			value={field.content}
			on:input={updateContent}
		/>

		<label class="label mt-2">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={showAddressAsText}
				on:input={updateShowAddressAsText}
			/>
			<span class="label-text">Show address as text</span>
		</label>

		<label class="label mt-2">
			<input
				type="checkbox"
				class="checkbox"
				bind:checked={showDirections}
				on:input={updateShowDirections}
			/>
			<span class="label-text">Show directions button</span>
		</label>
	</div>
{:else}
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
{/if}
