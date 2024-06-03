<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabaseClient: SupabaseClient;

	let googleButton;

	onMount(() => {
		loadGoogleScript()
			.then(() => {
				initializeGoogleButton();
			})
			.catch((error) => {
				console.error('Failed to load Google script:', error);
			});
	});

	async function handleCredentialResponse(response) {
		const resp = await supabaseClient.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential
		});

		if (resp.error) {
			console.error('Error during sign-in:', resp.error.message);
		} else {
			console.log('Sign-in with Google successful:', resp);
		}
	}

	function loadGoogleScript() {
		return new Promise((resolve, reject) => {
			if (document.getElementById('google-script')) {
				resolve(); // Script already loaded
				return;
			}
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			script.id = 'google-script';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	function initializeGoogleButton() {
		if (!googleButton) {
			console.error('Google button element is not available');
			return;
		}

		// Wait for fonts to load
		document.fonts.ready.then(() => {
			window.google.accounts.id.initialize({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				callback: handleCredentialResponse
			});
			window.google.accounts.id.renderButton(googleButton, {
				theme: 'outline', // or 'filled_blue', 'filled_black'
				size: 'large', // or 'small', 'medium'
				text: 'signin_with', // or 'signup_with', 'continue_with'
				shape: 'pill', // or 'rectangular'
				width: '250' // specify width if needed
			});
		});
	}
</script>

<div class="h-[44px] w-auto">
	<div class="flex justify-center mt-2" bind:this={googleButton}></div>
</div>
