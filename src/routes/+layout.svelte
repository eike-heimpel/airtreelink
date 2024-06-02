<script lang="ts">
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import { pwaInfo } from 'virtual:pwa-info';

	export let data;
	$: ({ session, supabase } = data);
	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

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

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	{@html webManifestLink}
	<meta name="robots" content="noindex, nofollow" />
	<meta name="theme-color" content="#65c3c8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<title>GuestLink</title>
</svelte:head>

<slot />

<Toaster />
