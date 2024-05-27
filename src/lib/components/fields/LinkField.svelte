<script lang="ts">
	import type { LinkField } from '$lib/types/fields';

	export let field: LinkField;
</script>

{#if field.url}
	<a class="link" href={field.url} target="_blank" rel="noopener noreferrer">{field.content}</a>
{/if}
