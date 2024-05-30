<script lang="ts">
	export let title: string;
	export let editMode: boolean;
</script>

{#if editMode}
	<div class="form-control">
		<h3 class="text-primary mb-2 text-xl">Title</h3>

		<input type="text" class="input input-primary" bind:value={title} />
	</div>
{:else}
	<h1 class="text-xl font-medium text-left">{title}</h1>
{/if}
