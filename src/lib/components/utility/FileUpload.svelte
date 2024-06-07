<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let minimumImageWidth = 0;
	export let minimumImageHeight = 0;
	export let maxImageWidth = 1920;
	export let maxImageHeight = 1080;
	export let quality = 0.8;

	const dispatch = createEventDispatcher();
	async function resizeImage(file: File, maxWidth: number, maxHeight: number, quality: number) {
		return new Promise<File>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = function (event) {
				const img = new Image();
				img.onload = function () {
					const canvas = document.createElement('canvas');
					let width = img.width;
					let height = img.height;

					if (width > maxWidth || height > maxHeight) {
						const aspectRatio = width / height;
						if (aspectRatio > 1) {
							width = maxWidth;
							height = width / aspectRatio;
						} else {
							height = maxHeight;
							width = height * aspectRatio;
						}
					}

					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(img, 0, 0, width, height);

					canvas.toBlob(
						(blob) => {
							const resizedFile = new File([blob], file.name, {
								type: 'image/webp',
								lastModified: Date.now()
							});
							resolve(resizedFile);
						},
						'image/webp',
						quality
					);
				};
				img.src = event?.target?.result as string;
			};
			reader.readAsDataURL(file);
		});
	}
	async function validateImageDimensions(file: File) {
		return new Promise<{
			valid: boolean;
			file: File;
			base64String: string;
			fullTempFile: string | null;
		}>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = async function (event) {
				const img = new Image();
				img.onload = async function () {
					if (img.width >= minimumImageWidth && img.height >= minimumImageHeight) {
						const resizedFile = await resizeImage(file, maxImageWidth, maxImageHeight, quality);
						const resizedReader = new FileReader();
						resizedReader.onload = function (resizedEvent) {
							const base64String = resizedEvent?.target?.result?.split(',')[1];
							resolve({
								valid: true,
								file: resizedFile,
								base64String,
								fullTempFile: resizedEvent?.target?.result
							});
						};
						resizedReader.readAsDataURL(resizedFile);
					} else {
						resolve({ valid: false, file, base64String: '', fullTempFile: null });
					}
				};
				img.src = event?.target?.result as string;
			};
			reader.readAsDataURL(file);
		});
	}
	async function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const {
				valid,
				file: validFile,
				base64String,
				fullTempFile
			} = await validateImageDimensions(file);
			if (valid) {
				dispatch('fileUploaded', {
					file: validFile,
					base64String,
					fullTempFile
				});
			} else {
				alert(`Image must be at least ${minimumImageWidth}x${minimumImageHeight} pixels`);
			}
		}
	}

	async function handleDrop(event) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		if (file) {
			const {
				valid,
				file: validFile,
				base64String,
				fullTempFile
			} = await validateImageDimensions(file);
			if (valid) {
				dispatch('fileUploaded', {
					file: validFile,
					base64String,
					fullTempFile
				});
			} else {
				alert(`Image must be at least ${minimumImageWidth}x${minimumImageHeight} pixels`);
			}
		}
	}
</script>

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
