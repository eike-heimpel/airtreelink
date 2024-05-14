<script>
	import { page } from '$app/stores';

	let mobileMenuOpen = false;
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
		class={`bg-base-100 w-full md:w-56 md:block ${mobileMenuOpen ? 'block absolute top-12 left-0 z-40' : 'hidden'}`}
	>
		<img src="/logo.webp" alt="Logo" class="w-20 mx-auto mt-4" />
		<ul class="menu p-4 gap-2">
			<li class="rounded-lg {$page.url.pathname.endsWith('/account') ? 'bg-neutral' : ''}">
				<a href="/private/{$page.params.userId}/account">Profile</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('/listings') ? 'bg-neutral' : ''}">
				<a href="/private/{$page.params.userId}/listings">Listings</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('/pricing') ? 'bg-neutral' : ''}">
				<a href="/pricing">Pricing</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('billing') ? 'bg-neutral' : ''}">
				<a href="/private/{$page.params.userId}/billing">Billing</a>
				<!-- Additional navigation items can be added here -->
			</li>
		</ul>
	</nav>

	<!-- Content area -->
	<div class="flex-1 bg-neutral">
		<slot></slot>
	</div>
</div>
