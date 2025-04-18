<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { AddressField } from '$lib/types/fields';
	import { createEventDispatcher, onMount } from 'svelte';
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import ContentCopy from 'virtual:icons/mdi/content-copy';
	import { copyTextToClipboard } from '$lib/utils/helpers';
	import { fade } from 'svelte/transition';

	export let field: AddressField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;
	export let lock = false;

	let showDirections = field.showDirections ?? true;
	let showAddressAsText = field.showAddressAsText ?? true;
	let suggestions = [];
	let autocompleteEnabled = true;
	let autocompleteService;
	let placeService;

	const dispatch = createEventDispatcher();

	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = initServices;
		document.head.appendChild(script);
	});

	function initServices() {
		autocompleteService = new google.maps.places.AutocompleteService();
		placeService = new google.maps.places.PlacesService(document.createElement('div'));
	}

	let isSearching = false;

	function searchAddress(event) {
		const query = event.target.value;
		dispatch('updateField', { key: 'content', value: query });

		if (query.length === 0) {
			autocompleteEnabled = true;
			isSearching = false;
		} else {
			isSearching = true;
		}

		if (autocompleteEnabled && query.length > 0) {
			const request = {
				input: query,
				language: 'en',
				types: ['geocode', 'establishment'] // Include more types
			};
			autocompleteService.getPlacePredictions(request, (predictions, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					suggestions = predictions.map((prediction) => ({
						place_id: prediction.place_id,
						description: prediction.description
					}));
				} else {
					suggestions = [];
				}
			});
		} else {
			suggestions = [];
		}
	}

	function selectSuggestion(suggestion) {
		placeService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				const address = place.formatted_address;
				dispatch('updateField', { key: 'content', value: address });
				field.content = address;
				suggestions = [];
			}
		});
	}

	function updateShowAddressAsText(event) {
		dispatch('updateField', { key: 'showAddressAsText', value: event.target.checked });
	}

	function updateShowDirections(event) {
		dispatch('updateField', { key: 'showDirections', value: event.target.checked });
	}

	function openDirections(address) {
		const encodedAddress = encodeURIComponent(address);
		const googleMapsAppUrl = `comgooglemaps://?daddr=${encodedAddress}`;
		const googleMapsWebUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile) {
			window.open(googleMapsWebUrl, '_blank');
		} else {
			// Directly open the web URL on desktop browsers
			window.open(googleMapsWebUrl, '_blank');
		}
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Address Field"
	{lock}
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div
		slot="content"
		class="form-control relative {isSearching
			? 'h-96'
			: ''}  transition-transform duration-300 ease-in-out"
	>
		{#if autocompleteEnabled && suggestions.length > 0}
			<ul
				transition:fade={{ duration: 200, delay: 200 }}
				class="menu border-4 border-black bg-base-100 rounded-box w-full z-50"
			>
				<div class="flex items-center text-accent italic">
					Choose an address from the list below (optional):
				</div>

				{#each suggestions as suggestion}
					<li class="p-1 border-b border-black">
						<button on:click|preventDefault={() => selectSuggestion(suggestion)}>
							<span>{suggestion.description}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
		<input
			type="text"
			class="input input-primary w-full"
			value={field.content}
			on:input={searchAddress}
		/>
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
			<button
				class="flex items-center mt-2 cursor-pointer"
				on:click={() => copyTextToClipboard(field.content)}
			>
				<p>{field.content}</p>
				<ContentCopy class="ml-2 w-5 h-5 text-primary" />
			</button>
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
