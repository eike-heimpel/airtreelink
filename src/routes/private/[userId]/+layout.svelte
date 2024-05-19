<script>
	import { page } from '$app/stores';

	export let data;

	$: ({ session, supabase } = data);

	// Logout function
	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error logging out:', error.message);
	};

	let mobileMenuOpen = false;

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
</script>

<div class="flex flex-col md:flex-row min-h-screen relative">
	<!-- Mobile menu button -->
	<button
		class="md:hidden p-4 focus:outline-none z-50"
		on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
	>
		{#if mobileMenuOpen}
			<!-- Close icon -->
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{:else}
			<!-- Hamburger icon -->
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16m-7 6h7"
				/>
			</svg>
		{/if}
	</button>

	<!-- Navigation menu -->
	<nav
		class={`navbar bg-base-200 shadow-xl w-full md:w-56 md:block ${mobileMenuOpen ? 'block absolute top-12 left-0 z-40 h-[calc(100vh-3rem)] flex flex-col items-center justify-start' : 'hidden'}`}
	>
		<a href="/" class="w-full flex justify-center" on:click={closeMobileMenu}>
			<img src="/logo.webp" alt="Logo" class="w-16 mx-auto mt-4 bg-white rounded-full p-1 mb-6" />
		</a>
		<ul class="menu gap-6 md:text-lg flex-col items-center w-full p-4 md:p-0">
			<li
				class={`rounded-lg ${$page.url.pathname.endsWith('/account') ? 'bg-neutral text-white' : ''}`}
				on:click={closeMobileMenu}
			>
				<a
					href="/private/{$page.params.userId}/account"
					class="flex items-center text-xl py-4 w-full justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM19 19c0-2.761-4.686-5-7-5s-7 2.239-7 5"
						/>
					</svg>
					Profile
				</a>
			</li>
			<li
				class={`rounded-lg ${$page.url.pathname.endsWith('/listings') ? 'bg-neutral text-white' : ''}`}
				on:click={closeMobileMenu}
			>
				<a
					href="/private/{$page.params.userId}/listings"
					class="flex items-center text-xl py-4 w-full justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 7h18M3 12h18m-7 5h7"
						/>
					</svg>
					Listings
				</a>
			</li>
			<li
				class={`rounded-lg ${$page.url.pathname.endsWith('/subscription') ? 'bg-neutral text-white' : ''}`}
				on:click={closeMobileMenu}
			>
				<a
					href="/private/{$page.params.userId}/subscription"
					class="flex items-center text-xl py-4 w-full justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-7 8h6m-6 4h6m-9 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
					Subscription
				</a>
			</li>
			<li on:click={closeMobileMenu} class="mt-4">
				<button
					class="btn btn-outline flex items-center text-xl w-full justify-center"
					on:click={logout}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-6 h-6 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12h-3m3-2a2 2 0 110-4 2 2 0 010 4zm-2 8H5a2 2 0 01-2-2v-1a2 2 0 012-2h2m4 0h1m0 0v-1a2 2 0 114 0v1"
						/>
					</svg>
					Sign Out
				</button>
			</li>
		</ul>
	</nav>

	<!-- Content area -->
	<div class="flex-1">
		<slot></slot>
	</div>
</div>
