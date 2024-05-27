<script lang="ts">
	import { editMode } from '$lib/stores/store';

	export let title: string;
	let editableTitle = title;
</script>

{#if $editMode}
	<div class="form-control">
		<label class="label">
			<span class="label-text">Title</span>
		</label>
		<input type="text" class="input input-bordered" bind:value={editableTitle} />
	</div>
{:else}
	<div class="flex items-center">
		<h1 class="text-xl font-medium">{title}</h1>
	</div>
{/if}
