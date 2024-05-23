<script lang="ts">
	import PricingPlans from '$components/PricingPlans/PricingPlans.svelte';

	export let data;
	$: ({ session, supabase } = data);

	let mobileMenuOpen = false;

	function scrollToSection(event, sectionId) {
		event.preventDefault();
		document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
	}

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
</script>

<nav class="navbar bg-base-200 py-2 px-8 fixed w-full z-20 shadow-lg">
	<div class="container mx-auto flex justify-between items-center">
		<div class="md:hidden flex items-center">
			<button class="p-4 focus:outline-none" on:click={() => (mobileMenuOpen = !mobileMenuOpen)}>
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
			{#if session}
				<a href="/private" class="btn btn-primary btn-sm md:btn-md">Account</a>
			{:else}
				<a href="/auth" class="btn btn-secondary btn-sm md:btn-md">Login/Signup</a>
			{/if}
		</div>
		<a href="/" class="text-2xl font-bold flex items-center md:order-1" on:click={closeMobileMenu}>
			<img src="/logo.webp" alt="Logo" class="w-8 sm:w-12 mx-auto" />GuestLink
		</a>
		<div class="hidden md:flex gap-8 items-center text-xl">
			{#if session}
				<a href="/private" on:click={closeMobileMenu} class="btn btn-primary">Account</a>
			{:else}
				<a href="/auth" on:click={closeMobileMenu} class="btn btn-secondary">Login/Signup</a>
			{/if}
			<a
				href="#home"
				on:click={(e) => {
					scrollToSection(e, 'home');
					closeMobileMenu();
				}}
				class="hover:text-primary">Home</a
			>
			<a
				href="#demo"
				on:click={(e) => {
					scrollToSection(e, 'demo');
					closeMobileMenu();
				}}
				class="hover:text-primary">Demo</a
			>
			<a
				href="#pricing"
				on:click={(e) => {
					scrollToSection(e, 'pricing');
					closeMobileMenu();
				}}
				class="hover:text-primary">Pricing</a
			>
		</div>
	</div>
	{#if mobileMenuOpen}
		<div
			class="md:hidden fixed inset-0 top-[4rem] bg-base-200 flex flex-col items-center justify-start gap-10 z-10"
		>
			<a
				href="#home"
				on:click={(e) => {
					scrollToSection(e, 'home');
					closeMobileMenu();
				}}
				class="block py-4 text-4xl hover:bg-base-300 w-full text-center">Home</a
			>
			<a
				href="#demo"
				on:click={(e) => {
					scrollToSection(e, 'demo');
					closeMobileMenu();
				}}
				class="block py-4 text-4xl hover:bg-base-300 w-full text-center">Demo</a
			>
			<a
				href="#pricing"
				on:click={(e) => {
					scrollToSection(e, 'pricing');
					closeMobileMenu();
				}}
				class="block py-4 text-4xl hover:bg-base-300 w-full text-center">Pricing</a
			>
		</div>
	{/if}
</nav>
<section id="home" class="min-h-screen bg-base-100 flex items-center p-4">
	<div class="w-full max-w-5xl mx-auto text-center py-12 flex flex-col gap-10 mt-8 md:mt-0">
		<h1 class="text-5xl font-bold">Welcome to GuestLink</h1>
		<p class="text-xl">
			The best way to share all the important info with your guests. For less than a coffee a month.
		</p>
		<div class="flex justify-center gap-4">
			<a
				href="#pricing"
				on:click={(e) => scrollToSection(e, 'pricing')}
				class="btn btn-primary btn-lg"
			>
				Get Started
			</a>
			<a href="#demo" on:click={(e) => scrollToSection(e, 'demo')} class="btn btn-secondary btn-lg">
				Demo
			</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="card border shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-primary">Unique Rotating Links</h3>
					<p>
						Provide guests with secure, unique URLs that offer a centralized hub for all
						property-related information, ensuring a seamless and personalized experience.
					</p>
				</div>
			</div>

			<div class="card border shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-primary">Customizable Information Pages</h3>
					<p>
						Share detailed stay instructions, local recommendations, and links to nearby
						attractions, all tailored to your property and guest needs.
					</p>
				</div>
			</div>

			<div class="card border shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-primary">Automated Guest Communication</h3>
					<p>
						Simplify and automate the sharing of essential information, reducing your workload and
						ensuring guests receive timely updates.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section
	id="demo"
	class="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4 p-4 text-center"
>
	<h2 class="text-4xl font-bold">See GuestLink in Action</h2>
	<p class="text-lg">Check out a demo of what your guests will see</p>
	<div class="flex justify-center">
		<div class="mockup-phone">
			<div class="camera"></div>
			<div class="display h-96">
				<img src="https://picsum.photos/200/400" alt="Demo" />
			</div>
		</div>
	</div>
</section>

<section id="pricing" class="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
	<PricingPlans supabaseSession={session} />
</section>

<footer class="bg-base-200 py-8 mt-10">
	<div
		class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
	>
		<div class="text-center md:text-left">
			<h2 class="text-lg font-bold">GuestLink</h2>
			<p class="mt-2">
				© 2024 GuestLink. All rights reserved. GuestLink is a website by Eike Heimpel. Small
				business according to § 19 UStG.
			</p>
		</div>
		<div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
			<a href="/imprint" class="text-gray-600 hover:text-gray-900">Imprint</a>
			<a href="/privacy-notice" class="text-gray-600 hover:text-gray-900">Privacy Notice</a>
			<a href="/terms-and-conditions" class="text-gray-600 hover:text-gray-900"
				>Terms and Conditions</a
			>
			<a href="/disclaimer" class="text-gray-600 hover:text-gray-900">Disclaimer</a>
			<a href="/contact" class="text-gray-600 hover:text-gray-900">Contact</a>
		</div>
	</div>
</footer>

<style>
	.coming-soon::after {
		content: 'Coming Soon';
	}
</style>
