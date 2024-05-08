<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let data;
	export let form;

	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let avatarUrl: string = profile?.avatar_url ?? '';

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
	<div class="w-full max-w-xl">
		<form
			class="card bg-base-100 shadow-xl p-4 space-y-4"
			method="post"
			action="?/update"
			use:enhance={handleSubmit}
			bind:this={profileForm}
		>
			<div class="form-control">
				<label class="label" for="email">Email</label>
				<input
					class="input input-bordered w-full"
					id="email"
					type="text"
					value={session.user.email}
					disabled
				/>
			</div>

			<div class="form-control">
				<label class="label" for="fullName">Full Name</label>
				<input
					class="input input-bordered w-full"
					id="fullName"
					name="fullName"
					type="text"
					value={form?.fullName ?? fullName}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="username">Username</label>
				<input
					class="input input-bordered w-full"
					id="username"
					name="username"
					type="text"
					value={form?.username ?? username}
				/>
			</div>

			<div class="form-control">
				<input
					type="submit"
					class="btn btn-primary w-full"
					value={loading ? 'Loading...' : 'Update'}
					disabled={loading}
				/>
			</div>
		</form>

		<form class="mt-4" method="post" action="?/signout" use:enhance={handleSignOut}>
			<button class="btn btn-outline btn-error w-full" disabled={loading}>Sign Out</button>
		</form>
	</div>
</div>
