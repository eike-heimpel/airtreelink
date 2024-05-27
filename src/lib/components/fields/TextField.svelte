<script lang="ts">
	import type { TextField } from '$lib/types/fields';

	export let field: TextField;
</script>

<p class="mt-2 text-neutral">{field.content}</p>
