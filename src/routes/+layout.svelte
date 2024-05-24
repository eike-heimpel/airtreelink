<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (!newSession) {
				if (window.location.pathname.includes('/private')) {
					setTimeout(() => {
						goto('/auth', { invalidateAll: true });
					});
				}
			} else if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			} else if (event === 'PASSWORD_RECOVERY') {
				console.log('PASSWROD RECOVERY');
				// const { url } = $page;
				// const { hash} = url;

				// const token = hash.split('&')[0].slice(14);
				// redirect user to the page where it creates a new password
				goto('/login/password-reset?token=' + session?.access_token);
			} else {
				// default action
				invalidate('supabase:auth');
			}
		});

		if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered with scope:', registration.scope);
				})
				.catch((error) => {
					console.log('Service Worker registration failed:', error);
				});
		}

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<slot />

<Toaster />
