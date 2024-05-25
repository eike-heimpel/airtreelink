<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { navigating } from '$app/stores';
	import { fly, slide } from 'svelte/transition';

	import MenuIcon from 'virtual:icons/mdi/menu';
	import CloseIcon from 'virtual:icons/mdi/close';
	import HomeIcon from 'virtual:icons/mdi/home';
	import DemoIcon from 'virtual:icons/mdi/eye';
	import PricingIcon from 'virtual:icons/mdi/cash';
	import AccountCircleOutline from 'virtual:icons/mdi/account-circle-outline';
	import LoginIcon from 'virtual:icons/mdi/login';
	import PricingPlans from '$components/PricingPlans/PricingPlans.svelte';

	export let data;
	$: ({ session, supabase } = data);

	let mobileMenuOpen = false;

	function scrollToSection(e, sectionId) {
		e.preventDefault();
		document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
		closeMobileMenu();
	}

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};
</script>

<nav class="navbar bg-base-200 py-2 px-4 md:px-8 fixed w-full z-20 shadow-lg">
	<div class="container mx-auto flex justify-between items-center">
		<!-- Mobile menu button and logo -->
		<div class="md:hidden flex items-center">
			<label class="btn btn-circle btn-ghost swap swap-rotate">
				<!-- This hidden checkbox controls the state -->
				<input type="checkbox" bind:checked={mobileMenuOpen} />
				<!-- Hamburger icon -->
				<MenuIcon class="swap-off fill-current w-6 h-6" />
				<!-- Close icon -->
				<CloseIcon class="swap-on fill-current w-6 h-6" />
			</label>
			<a href="/" class="text-2xl font-bold flex items-center" on:click={closeMobileMenu}>
				<img src="/logo.webp" alt="Logo" class="w-8 sm:w-12 mx-auto" />GuestLink
			</a>
		</div>
		<!-- Desktop menu and logo -->
		<a
			href="/"
			class="text-2xl font-bold flex items-center md:order-1 hidden md:flex"
			on:click={closeMobileMenu}
		>
			<img src="/logo.webp" alt="Logo" class="w-8 sm:w-12 mx-auto" />GuestLink
		</a>
		{#if session}
			<a
				href="/private"
				on:click={closeMobileMenu}
				class="btn btn-primary btn-sm md:btn-md flex items-center"
			>
				<AccountCircleOutline class="w-6 h-6 mr-2" /> Account
			</a>
		{:else}
			<a
				href="/auth"
				on:click={closeMobileMenu}
				class="btn btn-secondary btn-sm md:btn-md flex items-center"
			>
				<LoginIcon class="w-6 h-6 mr-2" /> Login/Signup
			</a>
		{/if}
		<div class="hidden md:flex gap-8 items-center text-xl">
			<a
				href="#home"
				on:click={(e) => scrollToSection(e, 'home')}
				class="hover:text-primary flex items-center"
			>
				<HomeIcon class="w-6 h-6 mr-2" /> Home
			</a>
			<a
				href="#demo"
				on:click={(e) => scrollToSection(e, 'demo')}
				class="hover:text-primary flex items-center"
			>
				<DemoIcon class="w-6 h-6 mr-2" /> Demo
			</a>
			<a
				href="#pricing"
				on:click={(e) => scrollToSection(e, 'pricing')}
				class="hover:text-primary flex items-center"
			>
				<PricingIcon class="w-6 h-6 mr-2" /> Pricing
			</a>
		</div>
	</div>
	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<div
			class="md:hidden fixed inset-0 top-[4rem] bg-base-200 flex flex-col items-center justify-start gap-10 z-10 p-4 shadow-lg"
		>
			<a
				href="#home"
				on:click={(e) => scrollToSection(e, 'home')}
				class="block py-4 text-2xl hover:bg-base-300 w-full text-center flex items-center justify-center rounded-lg"
			>
				<HomeIcon class="w-6 h-6 mr-2" /> Home
			</a>
			<a
				href="#demo"
				on:click={(e) => scrollToSection(e, 'demo')}
				class="block py-4 text-2xl hover:bg-base-300 w-full text-center flex items-center justify-center rounded-lg"
			>
				<DemoIcon class="w-6 h-6 mr-2" /> Demo
			</a>
			<a
				href="#pricing"
				on:click={(e) => scrollToSection(e, 'pricing')}
				class="block py-4 text-2xl hover:bg-base-300 w-full text-center flex items-center justify-center rounded-lg"
			>
				<PricingIcon class="w-6 h-6 mr-2" /> Pricing
			</a>
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
			<a href="/auth" class="btn btn-primary btn-lg"> Create Your Guest Page Now</a>
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
