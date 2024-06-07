<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let minimumImageWidth = 0;
	export let minimumImageHeight = 0;

	const dispatch = createEventDispatcher();

	function validateImageDimensions(file: File) {
		return new Promise<{
			valid: boolean;
			file: File;
			base64String: string;
			fullTempFile: string | null;
		}>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = function (event) {
				const img = new Image();
				img.onload = function () {
					if (img.width >= minimumImageWidth && img.height >= minimumImageHeight) {
						const base64String = event?.target?.result?.split(',')[1];
						resolve({ valid: true, file, base64String, fullTempFile: event?.target?.result });
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
