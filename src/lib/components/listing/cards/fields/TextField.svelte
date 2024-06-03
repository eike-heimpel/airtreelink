<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
	import BaseField from './BaseField.svelte';
	import FieldEditControls from './FieldEditControls.svelte';
	import type { TextField } from '$lib/types/fields';
	import { previewMode } from '$lib/stores/store';
	import DOMPurify from 'dompurify';

	export let field: TextField;
	export let index: number;
	export let totalFields: number;
	export let cardEditMode: boolean;

	function sanitizeHtml(html) {
		return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
	}

	let quill;
	const dispatch = createEventDispatcher();
	let editor: HTMLDivElement;

	async function initializeQuill() {
		await tick();

		quill = null;

		if (editor) {
			const { default: Quill } = await import('quill');
			await import('quill/dist/quill.snow.css');

			quill = new Quill(editor, {
				theme: 'snow',
				placeholder: 'Enter text here...'
			});

			quill.on('text-change', () => {
				const content = quill.root.innerHTML;
				const delta = JSON.stringify(quill.getContents());
				dispatch('updateField', { key: 'content', value: content });
				dispatch('updateField', { key: 'delta', value: delta });
			});

			// Set the initial content of the editor
			if (field.delta) {
				quill.setContents(JSON.parse(field.delta));
			} else if (field.content) {
				quill.root.innerHTML = field.content;
			}
		}
	}

	$: if (cardEditMode) {
		initializeQuill();
	}

	onDestroy(() => {
		if (quill) {
			quill = null;
		}
	});
</script>

<BaseField
	{field}
	{index}
	{totalFields}
	editMode={cardEditMode}
	title="Text Field"
	on:deleteField
	on:moveFieldUp
	on:moveFieldDown
>
	<div slot="content" class="h-40 flex flex-col">
		<div id="editor-container" class="flex-1 overflow-hidden flex flex-col">
			<div id="editor" bind:this={editor} class="flex-1 overflow-auto"></div>
		</div>
	</div>
	<div slot="preview">
		<div class="mt-2 text-neutral">
			{@html sanitizeHtml(field.content)}
		</div>
	</div>
</BaseField>

<style>
	#editor-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	#editor {
		flex-grow: 1;
		overflow-y: auto;
	}
</style>
