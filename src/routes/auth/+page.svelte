<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import zxcvbn from 'zxcvbn';

	export let data;
	let email = '';
	let password = '';
	let message = '';
	let passwordStrength = '';
	let progressBarClass = '';
	let showPasswordStrength = false;
	let isSignUpInProgress = false;
	const dispatch = createEventDispatcher();

	async function signInWithGithub() {
		try {
			const { error } = await data.supabase.auth.signInWithOAuth({
				provider: 'github'
			});
			if (error) throw error;
			console.log('Successfully signed in with GitHub');
		} catch (error) {
			console.error('Error signing in with GitHub:', error.message);
		}
	}

	async function signInWithGoogle() {
		alert('This feature is not yet implemented');
		return;
		try {
			const { error } = await data.supabase.auth.signInWithOAuth({
				provider: 'google'
			});
			if (error) throw error;
			console.log('Successfully signed in with Google');
		} catch (error) {
			console.error('Error signing in with Google:', error.message);
		}
	}

	async function signUpWithEmail() {
		showPasswordStrength = true;
		validatePasswordStrength();

		if (!validateEmail(email)) {
			message = 'Please enter a valid email address.';
			return;
		}

		if (passwordStrength.includes('Password is too weak')) {
			message = 'Password is too weak. Please choose a stronger password.';
			return;
		}

		isSignUpInProgress = true;

		try {
			const { error } = await data.supabase.auth.signUp({ email, password });
			if (error) {
				throw error;
			} else {
				message = 'Check your email for the confirmation link!';
				dispatch('signupSuccess');
				// Optionally redirect after a short delay
				setTimeout(() => {
					// Replace '/welcome' with the desired redirection path
					window.location.href = '/welcome';
				}, 3000); // 3-second delay before redirection
			}
		} catch (error) {
			console.error('Error signing up:', error.message);
			message = 'Error signing up. Please try again.';
			isSignUpInProgress = false;
		}
	}

	function validatePasswordStrength() {
		const result = zxcvbn(password);
		const score = result.score;
		const feedback = result.feedback.suggestions.join(' ');

		if (score < 3) {
			passwordStrength = `Password strength: ${score}/4 - Password is too weak. ${feedback}`;
			progressBarClass = 'w-1/4 bg-red-500';
		} else {
			passwordStrength = `Password strength: ${score}/4 - Strong`;
			if (score === 3) {
				progressBarClass = 'w-3/4 bg-yellow-500';
			} else {
				progressBarClass = 'w-full bg-green-500';
			}
		}
	}

	function validateEmail(email) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}
</script>

<form
	method="POST"
	action="?/login"
	class="flex flex-col space-y-4 p-6 rounded-lg shadow-md max-w-md mx-auto my-10"
>
	<div class="form-control w-full">
		<label class="label" for="email">
			<span class="label-text">Email</span>
		</label>
		<input
			name="email"
			type="email"
			placeholder="Enter your email"
			class="input input-bordered w-full"
			bind:value={email}
			on:input={() => (message = '')}
		/>
	</div>
	<div class="form-control w-full">
		<label class="label" for="password">
			<span class="label-text">Password</span>
		</label>
		<input
			name="password"
			type="password"
			placeholder="Enter your password"
			class="input input-bordered w-full"
			bind:value={password}
			on:input={() => {
				if (showPasswordStrength) validatePasswordStrength();
				message = '';
			}}
		/>
		{#if showPasswordStrength}
			<div class="w-full h-2 mt-2 bg-gray-300 rounded">
				<div class="h-full rounded transition-all duration-300 {progressBarClass}"></div>
			</div>
			<div class="text-sm text-gray-600 mt-2">{passwordStrength}</div>
		{/if}
	</div>
	<div class="flex flex-col space-y-2 mt-4">
		<button type="submit" class="btn btn-primary w-full">Login</button>
		<button
			type="button"
			class="btn btn-accent w-full"
			on:click={signUpWithEmail}
			disabled={!validateEmail(email) || password === '' || isSignUpInProgress}
			>Sign up with Email</button
		>
	</div>
	<div class="flex flex-col space-y-2 mt-4">
		<button
			type="button"
			class="btn btn-outline btn-accent flex items-center justify-center space-x-2 w-full"
			on:click={signInWithGithub}
		>
			<img src="/svgs/github_logo.svg" alt="GitHub Logo" class="w-5 h-5" />
			<span>Sign in with GitHub</span>
		</button>

		<button
			type="button"
			class="btn btn-outline btn-accent flex items-center justify-center space-x-2 w-full"
			on:click={signInWithGoogle}
		>
			<img src="/svgs/google_logo.svg" alt="Google Logo" class="w-5 h-5" />
			<span>Sign in with Google</span>
		</button>
	</div>
	{#if message}
		<div class="mt-4 text-center text-green-600">{message}</div>
	{/if}
</form>
