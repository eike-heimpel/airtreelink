<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ImageField } from '$lib/types/fields';
	import { editMode } from '$lib/stores/store';
	import FieldControls from './FieldControls.svelte';
	import { page } from '$app/stores';

	export let field: ImageField;
	export let index: number;
	export let totalFields: number;

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
		const { data, error } = await supabase.storage
			.from('listing_images')
			.upload(`${file.name}`, file);
		if (error) {
			console.error('Error uploading file:', error.message);
			return;
		}
		console.log('uploading', data);
		const fileUrl = supabase.storage.from('listing_images').getPublicUrl(data.path).publicUrl;
		dispatch('updateField', { key: 'url', value: fileUrl });
	}

	function updateAltText(event) {
		dispatch('updateField', { key: 'altText', value: event.target.value });
	}

	function deleteField() {
		dispatch('deleteField');
	}

	function moveFieldUp() {
		dispatch('moveFieldUp');
	}

	function moveFieldDown() {
		dispatch('moveFieldDown');
	}

	function openModal() {
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function deleteImage() {
		dispatch('updateField', { key: 'url', value: '' });
		uploadedImage = null;
	}
</script>

{#if $editMode}
	<div class="form-control p-4 bg-base-100">
		<div class="flex justify-between items-center mb-2">
			<h3 class="text-primary text-xl cursor-auto">Image Field</h3>
			<FieldControls
				{index}
				{totalFields}
				on:deleteField={deleteField}
				on:moveFieldUp={moveFieldUp}
				on:moveFieldDown={moveFieldDown}
			/>
		</div>
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
						<div class="flex flex-col items-center justify-center pt-5 pb-6">
							<img src={uploadedImage} alt={field.altText} class="mb-3 w-3/4 h-3/4 rounded" />
							<p class="mb-2 text-sm text-base-500">
								<span class="font-semibold">Click to upload</span> or drag and drop
							</p>
							<p class="text-xs text-base-500">SVG, PNG, JPG or GIF</p>
						</div>
					{:else}
						<div class="flex flex-col items-center justify-center pt-5 pb-6">
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
						</div>
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
			<span class="label-text">Alt Text</span>
		</label>
		<input type="text" class="input input-primary" value={field.altText} on:input={updateAltText} />
	</div>
{:else if field.url}
	<div class="relative">
		<img
			src={field.url}
			alt={field.altText}
			class="rounded cursor-pointer w-1/2 mx-auto"
			on:click={openModal}
		/>
	</div>
	<!-- Modal -->
	<dialog class="modal" class:modal-open={isModalOpen}>
		<div class="modal-box relative">
			<label
				for="my-modal-4"
				class="btn btn-sm btn-circle absolute right-2 top-2"
				on:click={closeModal}>✕</label
			>
			<img src={field.url} alt={field.altText} class="w-full rounded" />
		</div>
	</dialog>
{/if}
