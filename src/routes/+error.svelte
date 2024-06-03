<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-base-100">
	<div class="card shadow-lg rounded-lg max-w-md w-full">
		<div class="card-body">
			<h1 class="card-title text-primary">{$page.status} Error</h1>
			<p class="text-neutral">{$page?.error?.message}</p>
			<div class="card-actions">
				<a href="/" class="btn btn-primary w-full">Go to Homepage</a>
				{#if $page.data.session && $page.data.session !== undefined}
					<a href="/private" class="btn btn-secondary w-full">Go to Account</a>
				{/if}
			</div>
		</div>
	</div>
</div>
