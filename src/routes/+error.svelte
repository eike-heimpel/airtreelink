<script>
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
	<div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6 space-y-4">
		<h1 class="text-2xl font-bold text-red-600">Error</h1>
		<p class="text-gray-700">{$page.error.message}</p>
		<a href="/" class="btn btn-primary w-full">Go to Homepage</a>
	</div>
</div>
