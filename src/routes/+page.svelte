<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	$: ({ session, supabase } = data);
</script>

<div class="flex justify-center items-center h-96">
	{#if session}
		<div class="flex flex-col gap-4">
			<h1>Welcome, {session.user.email}</h1>
			<button class="btn btn-primary" on:click={() => goto('private')}>Go to account</button>
		</div>
	{:else}
		<div class="flex flex-col gap-4">
			<h1>Not logged in</h1>
			<button class="btn btn-primary" on:click={() => goto('auth')}>Go to Login</button>
		</div>
	{/if}
</div>
