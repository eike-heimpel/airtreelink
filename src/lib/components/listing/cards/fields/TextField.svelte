<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher, tick } from 'svelte';
	import BaseField from './BaseField.svelte';
	import FieldEditControls from './FieldEditControls.svelte';
	import type { TextField } from '$lib/types/fields';
	import { previewMode } from '$lib/stores/store';
	import DOMPurify from 'dompurify';
	import 'quill/dist/quill.snow.css';

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
	let renderedContent = field.content;

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

	async function renderDeltaToHtml(delta) {
		if (!delta) return field.content;

		const { default: Quill } = await import('quill');
		const Delta = Quill.import('delta');
		const deltaObj = new Delta(JSON.parse(delta));

		// Create a temporary Quill instance for conversion
		const tempQuill = new Quill(document.createElement('div'));
		tempQuill.setContents(deltaObj);

		// Convert the Quill content to HTML
		let html = tempQuill.root.innerHTML;

		// Replace Quill-specific list attributes with standard HTML
		html = html.replace(/<li data-list="bullet">/g, '<li style="list-style-type: disc;">');
		html = html.replace(/<li data-list="ordered">/g, '<li style="list-style-type: decimal;">');
		html = html.replace(/<ol>/g, '<ol style="padding-left: 1.5rem">');
		html = html.replace(/<a/g, '<a class="link"');

		return html;
	}

	$: if (!cardEditMode && field.delta) {
		renderDeltaToHtml(field.delta).then((html) => {
			renderedContent = sanitizeHtml(html);
		});
	}

	$: if (cardEditMode) {
		initializeQuill();
	}

	onDestroy(() => {
		if (quill) {
			quill = null;
		}
	});

	$: console.log('renderedContent', renderedContent);
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
	<div slot="content" class="h-52 md:h-80 flex flex-col">
		<div id="editor-container" class="flex-1 overflow-hidden flex flex-col">
			<div id="editor" bind:this={editor} class="flex-1 overflow-auto"></div>
		</div>
	</div>
	<div slot="preview">
		<div class="mt-2 text-neutral">
			{@html renderedContent || sanitizeHtml(field.content)}
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
