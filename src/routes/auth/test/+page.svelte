<script>
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	export let data;

	let googleButton;

	onMount(() => {
		loadGoogleScript().then(() => {
			window.google.accounts.id.initialize({
				client_id: PUBLIC_GOOGLE_CLIENT_ID,
				callback: handleCredentialResponse
			});
			window.google.accounts.id.renderButton(
				googleButton,
				{ theme: 'outline', size: 'large' } // customization attributes
			);
		});
	});
	async function handleCredentialResponse(response) {
		const resp = await data.supabase.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential
		});

		if (resp.error) {
			console.error('Error during sign-in:', resp.error.message);
		} else {
			console.log('Sign-in successful:', data);
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

<div bind:this={googleButton}></div>
