<script lang="ts">
	import { editMode } from '$lib/stores/store';

	export let title: string;
	let editableTitle = title;
</script>

{#if $editMode}
	<div class="form-control">
		<h3 class="text-primary mb-2 text-xl">Title</h3>

		<input type="text" class="input input-primary" bind:value={editableTitle} />
	</div>
{:else}
	<h1 class="text-xl font-medium text-left">{title}</h1>
{/if}
