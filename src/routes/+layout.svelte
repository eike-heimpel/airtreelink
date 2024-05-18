<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		// Check if the user has a preference
		const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		// Apply the appropriate theme
		if (userPrefersDark) {
			document.documentElement.setAttribute('data-theme', 'dark');
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}

		// Listen for changes to the system preference
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			if (event.matches) {
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				document.documentElement.setAttribute('data-theme', 'light');
			}
		});

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Only redirect to /auth if the current path includes /private
				 */
				if (window.location.pathname.includes('/private')) {
					/**
					 * Queue this as a task so the navigation won't prevent the
					 * triggering function from completing
					 */
					setTimeout(() => {
						goto('/auth', { invalidateAll: true });
					});
				}
			} else if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<slot />
