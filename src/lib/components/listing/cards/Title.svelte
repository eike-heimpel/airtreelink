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
	<div class="flex items-center">
		<h1 class="text-xl font-medium">{title}</h1>
	</div>
{/if}
