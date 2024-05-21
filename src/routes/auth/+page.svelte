<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import zxcvbn from 'zxcvbn';
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	export let data;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let passwordStrength = '';
	let progressBarClass = '';
	let showPasswordStrength = false;
	let isSignUpInProgress = false;
	let showConfirmPassword = false;
	const dispatch = createEventDispatcher();

	async function signInWithGithub() {
		toast
			.promise(
				data.supabase.auth.signInWithOAuth({
					provider: 'github'
				}),
				{
					loading: 'Signing in with GitHub...',
					success: 'Successfully signed in with GitHub',
					error: 'Error signing in with GitHub'
				}
			)
			.catch((error) => {
				toast.error('Error signing in with GitHub: ' + error.message);
			});
	}

	async function signInWithGoogle() {
		alert('This feature is not yet implemented');
		return;
		toast
			.promise(
				data.supabase.auth.signInWithOAuth({
					provider: 'google'
				}),
				{
					loading: 'Signing in with Google...',
					success: 'Successfully signed in with Google',
					error: 'Error signing in with Google'
				}
			)
			.catch((error) => {
				toast.error('Error signing in with Google: ' + error.message);
			});
	}

	async function signUpWithEmail() {
		showPasswordStrength = true;
		validatePasswordStrength();

		if (!validateEmail(email)) {
			toast.error('Please enter a valid email address.');
			return;
		}

		if (passwordStrength.includes('Password is too weak')) {
			toast.error('Password is too weak. Please choose a stronger password.');
			return;
		}

		if (!showConfirmPassword) {
			showConfirmPassword = true;
			toast('Please confirm your password to continue.', {
				style: 'background-color: white;'
			});
			return;
		}

		if (password !== confirmPassword) {
			toast.error('Passwords do not match. Please try again.');
			return;
		}

		isSignUpInProgress = true;

		toast
			.promise(data.supabase.auth.signUp({ email, password }), {
				loading: 'Signing up...',
				success: 'Check your email for the confirmation link!',
				error: 'Error signing up. Please try again.'
			})
			.then(() => {
				dispatch('signupSuccess');
			})
			.catch(() => {
				isSignUpInProgress = false;
			});
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

	const signInWithEmail: SubmitFunction = ({ result, update }) => {
		return async ({ result, update }) => {
			if (result.type === 'error') toast.error(result.error.message);
			if (result.type === 'redirect') {
				toast.success('Successfully signed in!');
				goto(result.location);
			}
		};
	};
</script>

<form
	use:enhance={signInWithEmail}
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
			on:input={() => toast.dismiss()}
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
				toast.dismiss();
			}}
		/>
		{#if showPasswordStrength}
			<div class="w-full h-2 mt-2 bg-gray-300 rounded">
				<div class="h-full rounded transition-all duration-300 {progressBarClass}"></div>
			</div>
			<div class="text-sm text-gray-600 mt-2">{passwordStrength}</div>
		{/if}
	</div>
	{#if showConfirmPassword}
		<div class="form-control w-full">
			<label class="label" for="confirmPassword">
				<span class="label-text">Confirm Password</span>
			</label>
			<input
				name="confirmPassword"
				type="password"
				placeholder="Confirm your password"
				class="input input-bordered w-full"
				bind:value={confirmPassword}
				on:input={() => toast.dismiss()}
			/>
		</div>
	{:else}
		<div class="flex flex-col space-y-2 mt-4">
			<button type="submit" class="btn btn-primary w-full">Login</button>
		</div>
	{/if}
	<button
		type="button"
		class="btn btn-accent w-full"
		on:click={signUpWithEmail}
		disabled={!validateEmail(email) || password === '' || isSignUpInProgress}
		>Sign up with Email</button
	>
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
</form>

<Toaster />
