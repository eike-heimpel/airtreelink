<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabaseClient: SupabaseClient;

	let googleButton;

	onMount(() => {
		loadGoogleScript().then(() => {
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
	});
	async function handleCredentialResponse(response) {
		console.log('ASDASDASD');
		console.log(response);
		const resp = await supabaseClient.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential
		});

		if (resp.error) {
			console.error('Error during sign-in:', resp.error.message);
		} else {
			console.log('Sign-in with Google successful:');
		}
	}

	function loadGoogleScript() {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}
</script>

<div class="flex justify-center mt-2" bind:this={googleButton}></div>
