<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Tooltip from '$components/UI/Tooltip.svelte';

	export let data;
	export let form;

	let { session, supabase, user, subscription } = data;
	$: ({ session, supabase, user, subscription } = data);

	let passwordForm: HTMLFormElement;
	let deleteForm: HTMLFormElement;
	let loading = false;
	let showDeleteModal = false;
	let showDeletionNotice = false;
	let userInputEmail = '';

	function openDeleteModal() {
		showDeleteModal = true;
	}

	function closeDeleteModal() {
		showDeleteModal = false;
	}

	const handleDeleteAccount: SubmitFunction = ({ result, update }) => {
		loading = true;
		return async ({ result, update }) => {
			loading = false;
			if (result.type === 'success') {
				showDeleteModal = false;
				showDeletionNotice = true;
				update();
			}
		};
	};
</script>

<div class="flex justify-center items-center min-h-screen p-4">
	<div class="w-full max-w-xl">
		<!-- User Email -->
		<div class="card bg-base-100 shadow-xl p-4 space-y-4">
			<div class="form-control">
				<label class="label" for="email"
					>Email <Tooltip
						tooltipText="To change your email, please send an email to support@myguestlink.com."
					/>
				</label>
				<input
					class="input input-bordered w-full"
					id="email"
					type="text"
					value={session.user.email}
					disabled
				/>
			</div>
		</div>

		<!-- Change Password Form -->
		<form
			class="card bg-base-100 shadow-xl p-4 space-y-4 mt-4"
			method="post"
			action="?/changePassword"
			use:enhance
			bind:this={passwordForm}
		>
			<div class="form-control">
				<label class="label" for="newPassword">New Password</label>
				<input
					class="input input-bordered w-full"
					id="newPassword"
					name="newPassword"
					type="password"
				/>
			</div>

			<div class="form-control">
				<input
					type="submit"
					class="btn btn-primary w-full"
					value={loading ? 'Loading...' : 'Change Password'}
					disabled={loading}
				/>
			</div>
		</form>

		<div class="flex flex-col items-center space-y-4 mt-4">
			<!-- Sign Out Button -->
			<form class="w-full max-w-72" method="post" action="?/signout" use:enhance>
				<div>
					<button class="btn btn-outline w-full" disabled={loading}>Sign Out</button>
				</div>
			</form>

			<!-- Delete Account Button -->
			{#if !subscription || subscription.status === 'canceled' || subscription.cancel_at_period_end}
				<button
					class="btn btn-error btn-outline w-full max-w-44"
					on:click={openDeleteModal}
					disabled={loading}>Delete Account</button
				>
			{:else}
				<button
					class="btn btn-error btn-outline w-full max-w-44"
					on:click={openDeleteModal}
					disabled>Delete Account</button
				>
				<div class="alert alert-ghost w-full">
					<p>Please cancel your subscription if you want to delete your account.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

{#if showDeleteModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h3 class="font-bold text-lg">Confirm Deletion</h3>
			<p class="py-4">
				Please type your email <strong>{session.user.email}</strong> to confirm account deletion.
			</p>
			<input type="text" bind:value={userInputEmail} class="input input-bordered w-full" />
			<div class="modal-action justify-end align-center">
				<button class="btn mr-2" on:click={closeDeleteModal}>Cancel</button>
				<form
					method="post"
					action="?/deleteAccount"
					class="inline"
					use:enhance={handleDeleteAccount}
					bind:this={deleteForm}
				>
					<input type="hidden" name="email" value={session.user.email} />
					<button
						type="submit"
						class="btn btn-error"
						disabled={userInputEmail !== session.user.email}>Delete</button
					>
				</form>
			</div>
		</div>
	</div>
{/if}

{#if showDeletionNotice}
	<div class="alert alert-success mt-4">
		<p>
			Your request to delete your account has been received. All data associated with your account
			will be deleted within 30 days, unless required by law to retain it.
		</p>
	</div>
{/if}
