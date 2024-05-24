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

<!-- Navbar (unchanged) -->
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
	<div class="w-full max-w-5xl mx-auto text-center py-12 flex flex-col gap-8 mt-8 md:mt-0">
		<h1 class="text-3xl sm:text-5xl font-bold">Simplify Guest Communication with GuestLink</h1>
		<p class="text-lg md:text-xl">
			Streamline your guest experience by sharing all the essential information in one place. Get
			started for <a
				href="#pricing"
				class="text-accent link font-bold"
				on:click={(e) => scrollToSection(e, 'pricing')}>less than the price a coffee a month.</a
			>
		</p>
		<div class="flex flex-col md:flex-row justify-center gap-4">
			<a href="/auth" class="btn btn-primary btn-lg"> Create Your Guest Page Now </a>
			<div class="grid grid-cols-2 gap-2">
				<a
					href="#demo"
					on:click={(e) => scrollToSection(e, 'demo')}
					class="btn btn-secondary sm:btn-lg"
				>
					See Demo
				</a>
				<a
					href="#pricing"
					on:click={(e) => scrollToSection(e, 'pricing')}
					class="btn btn-accent sm:btn-lg"
				>
					Pricing
				</a>
			</div>
		</div>
		<p class="text-base md:text-lg mt-4">
			Generate your personalized guest page for free. Only pay when you're ready to publish and
			share it with your guests. No payment details required until you decide to go live.
		</p>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<div class="card border-primary border-4 shadow-primary shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-primary text-lg md:text-xl">Secure & Personalized Links</h3>
					<p class="text-base">
						Provide guests with unique, secure URLs for a centralized hub of property information,
						ensuring a seamless experience.
					</p>
				</div>
			</div>
			<div class="card border-secondary border-4 shadow-secondary shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-secondary text-lg md:text-xl">Boost Guest Satisfaction</h3>
					<p class="text-base">
						GuestLink empowers you to provide an exceptional guest experience by ensuring they have
						all the information they need at their fingertips, leading to higher satisfaction and
						positive reviews.
					</p>
				</div>
			</div>

			<div class="card border-accent border-4 shadow-accent shadow-md p-4">
				<div class="card-body">
					<h3 class="card-title text-accent text-lg md:text-xl">Effortless for Hosts & Guests</h3>
					<p class="text-base">
						GuestLink's intuitive platform simplifies the process of sharing and accessing essential
						property information for both hosts and guests.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-8">
			<h2 class="text-2xl md:text-3xl font-bold">Why GuestLink is the Smart Choice</h2>
			<p class="text-base md:text-lg mt-4">
				GuestLink outshines the competition with faster setup, easier use, and prices over 80% lower
				than our rivals. Experience the GuestLink advantage today!
			</p>
		</div>
	</div>
</section>
<section
	id="demo"
	class="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4 md:gap-12 p-4 text-center"
>
	<h2 class="text-2xl sm:text-4xl font-bold">
		Experience GuestLink's <span class="text-accent"> Simplicity </span>
	</h2>
	<p class="text-lg">Take a peek at what your guests will see</p>
	<div class="flex justify-center">
		<div class="mockup-phone">
			<div class="camera"></div>
			<div class="display h-96">
				<img src="https://picsum.photos/200/800" alt="Demo" />
			</div>
		</div>
	</div>
	<div class="flex gap-2 sm:gap-8 md:gap-16">
		<a href="/auth" class="btn btn-primary btn-lg">Get Started</a>
		<a
			href="#pricing"
			on:click={(e) => scrollToSection(e, 'pricing')}
			class="btn btn-accent btn-lg"
		>
			Pricing
		</a>
	</div>
</section>
<section id="pricing" class="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
	<PricingPlans supabaseSession={session} />
</section>
<!-- Footer (unchanged) -->
<footer class="bg-base-200 py-8 mt-10">
	<!-- ... -->
</footer>

<style>
	.coming-soon::after {
		content: 'Coming Soon';
	}
</style>
