<script lang="ts">
	import BaseField from './BaseField.svelte';
	import FileUpload from '$components/utility/FileUpload.svelte';
	import type { ImageField } from '$lib/types/fields';
	import { createEventDispatcher } from 'svelte';
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { nanoid } from 'nanoid';

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

	function handleFileUploaded({ detail: { file, base64String, fullTempFile } }) {
		const extension = file.name.split('.').pop();
		const fileName = nanoid(12) + '.' + extension;

		onTempImageUpdate(index, {
			fileName: fileName,
			file: base64String,
			altText: file.name,
			fullTempFile: fullTempFile
		});
		dispatch('updateField', { key: 'altText', value: file.name });
		dispatch('updateField', { key: 'fileName', value: fileName });
	}

	function deleteTempImage() {
		onTempImageUpdate(index, null);
		dispatch('updateField', { key: 'fileName', value: '' });
	}
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
				<div class="flex justify-center items-center">
					<img
						src={tempImage ? tempImage.fullTempFile : fileUrl.replace(/\.[^/.]+$/, '.webp')}
						alt={field.altText}
						class="mb-3 w-full rounded w-1/2 md:w-1/3"
					/>
				</div>

				<button class="btn btn-sm btn-circle absolute top-2 right-2" on:click={deleteTempImage}
					>✕</button
				>
			</div>
		{:else}
			<FileUpload on:fileUploaded={handleFileUploaded} />
		{/if}
	</div>
	<div slot="preview" class:h-screen={isModalOpen}>
		{#if tempImage?.fileName || field.fileName}
			{#if isModalOpen}
				<dialog class="modal" class:modal-open={isModalOpen}>
					<div class="modal-box">
						<button
							class="btn btn-sm btn-circle absolute right-2 top-2"
							on:click={() => (isModalOpen = false)}>✕</button
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
				<button
					class="relative"
					on:click={() => {
						isModalOpen = true;
					}}
				>
					<img
						src={tempImage ? tempImage.fileName : fileUrl.replace(/\.[^/.]+$/, '.webp')}
						alt={field.altText}
						class="rounded cursor-pointer w-1/2 md:w-1/3 mx-auto"
					/>
				</button>
			{/if}
		{/if}
	</div>
</BaseField>
