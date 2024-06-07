<script lang="ts">
	import BaseField from './BaseField.svelte';
	import type { ImageField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';

	export let field: ImageField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;
	export let tempImage: {
		fileName: string;
		file: File;
		altText: string;
		fullTempFile?: ArrayBuffer | string | null | undefined;
	};
	export let lock = false;
	export let onTempImageUpdate: (
		index: number,
		tempImage: {
			fileName: string;
			file: string;
			altText: string;
			fullTempFile?: ArrayBuffer | string | null | undefined;
		}
	) => void;
	export let listingHash: string;

	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let fileUrl: string;

	$: fileUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images/${listingHash}/${field.fileName}`;

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (event) {
				const base64String = event?.target?.result?.split(',')[1];
				const extension = file.name.split('.').pop();
				const fileName = field.id + '.' + extension;
				onTempImageUpdate(index, {
					fileName: fileName,
					file: base64String,
					altText: file.name,
					fullTempFile: event?.target?.result
				});
				dispatch('updateField', { key: 'altText', value: file.name });
				dispatch('updateField', { key: 'fileName', value: fileName });
			};
			reader.readAsDataURL(file);
		}
	}

	function handleDrop(event) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (event) {
				const base64String = event?.target?.result?.split(',')[1];
				const extension = file.name.split('.').pop();
				const fileName = field.id + '.' + extension;
				onTempImageUpdate(index, {
					fileName: fileName,
					file: base64String,
					altText: file.name,
					fullTempFile: event?.target?.result
				});
				dispatch('updateField', { key: 'altText', value: file.name });
				dispatch('updateField', { key: 'fileName', value: fileName });
			};
			reader.readAsDataURL(file);
		}
	}

	function deleteTempImage() {
		onTempImageUpdate(index, null);
		dispatch('updateField', { key: 'fileName', value: '' });
	}
	$: console.log(tempImage);
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Image Field"
	{lock}
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="form-control">
		{#if tempImage?.fileName || field.fileName}
			<div class="relative">
				<img
					src={tempImage ? tempImage.fullTempFile : fileUrl.replace(/\.[^/.]+$/, '.webp')}
					alt={field.altText}
					class="mb-3 w-full rounded w-1/2 md:w-1/3"
				/>
				<button class="btn btn-sm btn-circle absolute top-2 right-2" on:click={deleteTempImage}
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
	</div>
	<div slot="preview" class:h-screen={isModalOpen}>
		{#if tempImage?.fileName || field.fileName}
			{#if isModalOpen}
				<dialog class="modal" class:modal-open={isModalOpen}>
					<div class="modal-box">
						<label
							class="btn btn-sm btn-circle absolute right-2 top-2"
							on:click={() => (isModalOpen = false)}>✕</label
						>
						<img
							src={tempImage ? tempImage.fileName : fileUrl.replace(/\.[^/.]+$/, '.webp')}
							alt={field.altText}
							class="max-w-full h-auto rounded"
						/>
					</div>
					<form method="dialog" class="modal-backdrop">
						<button on:click={() => (isModalOpen = false)}>close</button>
					</form>
				</dialog>
			{:else}
				<div class="relative">
					<img
						src={tempImage ? tempImage.fileName : fileUrl.replace(/\.[^/.]+$/, '.webp')}
						alt={field.altText}
						class="rounded cursor-pointer w-1/2 md:w-1/3 mx-auto"
						on:click={() => (isModalOpen = true)}
					/>
				</div>
			{/if}
		{/if}
	</div>
</BaseField>
