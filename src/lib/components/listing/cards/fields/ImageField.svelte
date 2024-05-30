<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { ImageField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	export let field: ImageField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	let supabase = $page.data.supabase;
	let uploadedImage = null;
	let isModalOpen = false;

	const dispatch = createEventDispatcher();

	async function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			await uploadImage(file);
		}
	}

	async function handleDrop(event) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) {
			await uploadImage(file);
		}
	}

	async function uploadImage(file) {
		uploadedImage = URL.createObjectURL(file);
		console.log(file);
		const { data, error } = await supabase.storage
			.from('listing_images')
			.upload(`${file.name}`, file);
		if (error) {
			console.error('Error uploading file:', error.message);
			return;
		}
		const { data: image } = await supabase.storage.from('listing_images').getPublicUrl(data.path);
		dispatch('updateField', { key: 'url', value: image.publicUrl });
	}

	function updateAltText(event) {
		dispatch('updateField', { key: 'altText', value: event.target.value });
	}

	async function deleteImage() {
		if (field.url) {
			const filePath = field.url.split('/').pop();
			const { error } = await supabase.storage.from('listing_images').remove([filePath]);
			if (error) {
				console.error('Error deleting file:', error.message);
				return;
			}
			dispatch('updateField', { key: 'url', value: '' });
			uploadedImage = null;
		}
	}
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Image Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		{#if field.url}
			<div class="relative">
				<img src={field.url} alt={field.altText} class="mb-3 w-full rounded" />
				<button class="btn btn-sm btn-circle absolute top-2 right-2" on:click={deleteImage}
					>✕</button
				>
			</div>
		{:else}
			<div class="flex items-center justify-center w-full">
				<label
					for="dropzone-file"
					class="flex flex-col items-center justify-center w-full h-64 border-2 border-base-300 border-dashed rounded-lg cursor-pointer bg-base-200 hover:bg-base-300"
					on:dragover|preventDefault
					on:drop={handleDrop}
				>
					{#if uploadedImage}
						<img src={uploadedImage} alt={field.altText} class="mb-3 w-3/4 h-3/4 rounded" />
						<p class="mb-2 text-sm text-base-500">
							<span class="font-semibold">Click to upload</span> or drag and drop
						</p>
						<p class="text-xs text-base-500">SVG, PNG, JPG or GIF</p>
					{:else}
						<svg
							aria-hidden="true"
							class="w-10 h-10 mb-3 text-base-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							></path>
						</svg>
						<p class="mb-2 text-sm text-base-500">
							<span class="font-semibold">Click to upload</span> or drag and drop
						</p>
						<p class="text-xs text-base-500">SVG, PNG, JPG or GIF</p>
					{/if}
					<input
						id="dropzone-file"
						type="file"
						class="hidden"
						accept="image/*"
						on:change={handleFileUpload}
					/>
				</label>
			</div>
		{/if}
		<label class="label mt-4">
			<span class="label-text">Description (optional)</span>
		</label>
		<input type="text" class="input input-primary" value={field.altText} on:input={updateAltText} />
	</div>
	<div slot="preview">
		{#if field.url}
			<div class="relative">
				<img
					src={field.url}
					alt={field.altText}
					class="rounded cursor-pointer w-1/2 mx-auto"
					on:click={() => (isModalOpen = true)}
				/>
			</div>
			<dialog class="modal" class:modal-open={isModalOpen}>
				<div class="modal-box relative">
					<label
						class="btn btn-sm btn-circle absolute right-2 top-2"
						on:click={() => (isModalOpen = false)}>✕</label
					>
					<img src={field.url} alt={field.altText} class="w-full rounded" />
				</div>
			</dialog>
		{/if}
	</div>
</BaseField>
