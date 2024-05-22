<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import zxcvbn from 'zxcvbn';
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import GoogleLogin from '$components/auth/GoogleLogin.svelte';

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
	let showPasswordResetModal = false;

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
			.promise(signUpViaBackend(email, password), {
				loading: 'Signing up...',
				success: 'Check your email for the confirmation link!',
				error: 'Error signing up.'
			})
			.then((data) => {
				dispatch('signupSuccess');
			})
			.catch((err) => {
				isSignUpInProgress = false;
				toast.error(err.toString());
			});
	}

	async function signUpViaBackend(email: string, password: string) {
		const response = await fetch('/api/auth/sign-up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: email,
				password: password
			})
		});

		if (!response.ok) {
			throw new Error('Error signing up.');
		}

		const data = await response.json();

		if (data?.signedUpAlready) {
			throw new Error('Looks like you already have an account, try to log in.');
		}
		return data;
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
			if (result.type === 'error') {
				toast.error(result.error.message);
			}
			if (result.type === 'redirect') {
				toast.success('Successfully signed in!');
				goto(result.location);
			}
		};
	};

	function resetPassword() {
		showPasswordResetModal = true;
	}

	async function sendResetPasswordEmail(email: string) {
		toast.promise(
			data.supabase.auth.signInWithOtp({
				email: email,
				options: {
					emailRedirectTo: `${$page.url.origin}/private`
				}
			}),
			{
				loading: 'Sending login link...',
				success: `Login link sent to ${email}. Please check your inbox.`,
				error: 'Error sending email. Please try again later.'
			}
		);

		showPasswordResetModal = false;
	}
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center">
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="flex justify-center mb-6">
				<img src="/logo.webp" alt="Logo" class="h-12" />
			</div>
			<h2 class="card-title justify-center text-3xl mb-8">Login</h2>
			<form
				use:enhance={signInWithEmail}
				method="POST"
				action="?/login"
				class="flex flex-col space-y-4"
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
			</form>
			<GoogleLogin supabaseClient={data.supabase} />
		</div>
		<button type="button" class="flex justify-center mb-2 cursor-pointer" on:click={resetPassword}>
			Reset Password
		</button>
	</div>
</div>

{#if showPasswordResetModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
		<div class="bg-base-100 p-6 rounded-lg shadow-xl">
			<h3 class="text-lg font-bold mb-4">Reset Password</h3>
			<p class="mb-4 max-w-96">
				Please enter your email address. We will send you a link to login. Once logged in, simply go
				to your profile and add a new password.
			</p>
			<input type="email" class="input input-bordered w-full mb-4" bind:value={email} />
			<div class="flex justify-end space-x-2">
				<button class="btn btn-secondary" on:click={() => (showPasswordResetModal = false)}
					>Cancel</button
				>
				<button class="btn btn-primary" on:click={() => sendResetPasswordEmail(email)}
					>Send Email</button
				>
			</div>
		</div>
	</div>
{/if}

<Toaster />
