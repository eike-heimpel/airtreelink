<script>
	import { page } from '$app/stores';

	let mobileMenuOpen = false;
</script>

<div class="flex flex-col md:flex-row min-h-screen bg-slate-200">
	<!-- Mobile menu button -->
	<button
		class="md:hidden p-4 focus:outline-none focus:bg-gray-300"
		on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
	>
		<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16m-7 6h7"
			/>
		</svg>
	</button>

	<!-- Navigation menu -->
	<nav
		class={`bg-base-200 w-1/2 md:w-56 rounded-box ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}
		class:absolute={mobileMenuOpen}
		class:top-10={mobileMenuOpen}
	>
		<img src="/logo.webp" alt="Logo" class="w-20 mx-auto mt-4" />
		<ul class="menu">
			<li class="rounded-lg {$page.url.pathname.endsWith('/account') ? 'bg-secondary' : ''}">
				<a href="/private/{$page.params.userId}/account">Profile</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('/listings') ? 'bg-secondary' : ''}">
				<a href="/private/{$page.params.userId}/listings">Listings</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('/pricing') ? 'bg-secondary' : ''}">
				<a href="/pricing">Pricing</a>
			</li>
			<li class="rounded-lg {$page.url.pathname.endsWith('billing') ? 'bg-secondary' : ''}">
				<a href="/private/{$page.params.userId}/billing">Billing</a>
				<!-- Additional navigation items can be added here -->
			</li>
		</ul>
	</nav>

	<!-- Content area -->
	<div class="flex-1">
		<slot></slot>
	</div>
</div>
