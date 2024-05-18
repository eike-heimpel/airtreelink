<script lang="ts">
	import { goto } from '$app/navigation';

	export let data;
	$: ({ session, supabase } = data);

	let basicQuantity = 1;

	function updateQuantity(plan, change) {
		if (plan === 'basic') {
			basicQuantity += change;
			if (basicQuantity < 1) basicQuantity = 1;
			if (basicQuantity > 5) basicQuantity = 5;
			document.getElementById('basicQuantity').value = basicQuantity;
			document.getElementById('decreaseQuantity').disabled = basicQuantity === 1;
			document.getElementById('increaseQuantity').disabled = basicQuantity === 5;
		}
	}

	async function handleBasicPlanPurchase() {
		const quantity = basicQuantity;
		if (!session) {
			goto('/auth');
			return;
		}

		try {
			goto(`/api/stripe/checkout?userId=${session.user.id}&plan=basic&quantity=${quantity}`);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	function handlePremiumPlanPurchase() {
		console.log('Purchasing premium plan...');
	}

	function scrollToSection(event, sectionId) {
		event.preventDefault();
		document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
	}
</script>

<nav class="navbar bg-base-200 p-4 fixed w-full z-10 shadow-lg">
	<div class="container mx-auto flex justify-between items-center">
		<a href="/" class="text-2xl font-bold flex gap-4 items-center">
			<img src="/logo.webp" alt="Logo" class="w-8 sm:w-16 mx-auto bg-white rounded-full" /> Airtree
		</a>
		<div class="space-x-4 flex items-center">
			<a href="#home" on:click={(e) => scrollToSection(e, 'home')} class="hover:text-primary"
				>Home</a
			>
			<a href="#demo" on:click={(e) => scrollToSection(e, 'demo')} class="hover:text-primary"
				>Demo</a
			>
			<a href="#pricing" on:click={(e) => scrollToSection(e, 'pricing')} class="hover:text-primary"
				>Pricing</a
			>
			{#if session}
				<a href="/private" class="btn btn-primary">Account</a>
			{:else}
				<a href="/auth" class="btn btn-secondary">Login/Signup</a>
			{/if}
		</div>
	</div>
</nav>
<section id="home" class="min-h-screen bg-base-100 flex items-center p-4">
	<div class="w-full max-w-5xl mx-auto text-center py-12 flex flex-col gap-10">
		<h1 class="text-5xl font-bold mb-6">Welcome to Airtree</h1>
		<p class="text-xl mb-6">The best way to share all the important info with your guests</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

		<a
			href="#pricing"
			on:click={(e) => scrollToSection(e, 'pricing')}
			class="btn btn-primary btn-lg mx-auto"
		>
			Get Started
		</a>
	</div>
</section>

<section id="demo" class="min-h-screen bg-base-100 flex items-center justify-center p-4">
	<div class="text-center">
		<h2 class="text-4xl font-bold mb-6">See Airtree in Action</h2>
		<p class="text-lg mb-6">Check out a demo of what your guests will see</p>
		<div class="flex justify-center">
			<!-- Placeholder for demo content -->
			<div class="w-3/4 p-4 rounded-lg shadow-lg">
				<p class="text-lg">Demo content goes here...</p>
			</div>
		</div>
	</div>
</section>

<section id="pricing" class="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
	<h1 class="text-4xl font-bold mb-10">Choose Your Plan</h1>
	<p class="text-lg mb-10 text-center max-w-4xl">
		We currently offer the Simple Plan, which includes everything you need to get started. Stay
		tuned for our Premium Plan with additional features coming soon! Not sure yet? Pick 1 month and
		turn off auto renewal. See what your guests think and come back if you like it.
	</p>
	<div class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
		<!-- Basic Plan -->
		<div class="card p-6 rounded-lg shadow-xl w-full max-w-sm flex flex-col justify-between">
			<div>
				<h2 class="text-2xl font-bold mb-4">Basic</h2>
				<div class="text-5xl font-bold mb-4">$1<span class="text-xl">/listing</span></div>
				<ul class="mb-4 space-y-2">
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Host public URL with your listing
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Unique private URL
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Unlimited modify listing info updates
					</li>
				</ul>
				<p class="text-center mb-4 italic">
					Choose the number of listings you want to add. You can always add more later.
				</p>
				<div class="flex items-center justify-center space-x-2 mb-2">
					<button
						class="btn btn-primary"
						id="decreaseQuantity"
						on:click={() => updateQuantity('basic', -1)}
						disabled
					>
						-
					</button>
					<div class="flex items-center justify-center">
						<input
							type="number"
							id="basicQuantity"
							class="input input-bordered w-20 text-center"
							value="1"
							readonly
						/>
					</div>
					<button
						class="btn btn-primary"
						id="increaseQuantity"
						on:click={() => updateQuantity('basic', 1)}
					>
						+
					</button>
				</div>
				{#if basicQuantity >= 5}
					<p class="text-center text-sm text-gray-500 w-full break-words">
						Contact Support for more listings.
					</p>
				{/if}
			</div>
			<button class="btn btn-primary w-full mt-4" on:click={handleBasicPlanPurchase}
				>Get Basic Plan</button
			>
		</div>

		<!-- Premium Plan -->
		<div
			class="card opacity-50 p-6 rounded-lg shadow-lg w-full max-w-sm relative flex flex-col justify-between"
		>
			<div>
				<h2 class="text-2xl font-bold mb-4">Premium</h2>
				<div class="text-5xl font-bold mb-4">$3<span class="text-xl">/listing</span></div>
				<ul class="mb-4 space-y-2">
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Everything in the Basic plan
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Generate multiple URLs per listing with
						different content
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Add a password to the public listing
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>URL hash and password rotation
					</li>
					<li class="flex items-center">
						<span class="text-green-500 mr-2">✓</span>Permission to add affiliate links to generate
						revenue
					</li>
				</ul>
			</div>
			<button class="btn btn-primary w-full opacity-50 cursor-not-allowed mt-4" disabled
				>Get Premium Plan</button
			>
			<div class="absolute top-2 right-2 bg-accent text-black px-2 py-1 rounded text-xs font-bold">
				Coming Soon
			</div>
		</div>
	</div>

	<!-- <div class="mt-12">
		<h2 class="text-4xl font-semibold mb-4">Our Basic Plan</h2>
		<p class="text-lg mb-4">
			Our basic plan offers an efficient, cost-effective solution for short-term rental hosts to
			enhance guest experiences and streamline property management. For just $2 per listing per
			month, enjoy the following benefits:
		</p>

		<p class="text-lg mt-6">
			Our service integrates effortlessly into your existing operations, offering a low barrier to
			entry with significant returns in guest satisfaction and operational efficiency. Join our
			growing community of hosts who are transforming their rental properties into memorable
			experiences for their guests.
		</p>
	</div> -->
</section>

<footer class="bg-base-200 py-8 mt-10">
	<div
		class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
	>
		<div class="text-center md:text-left">
			<h2 class="text-lg font-bold">Airtree</h2>
			<p class="mt-2">
				© 2024 Airtree. All rights reserved. Airtree is a website by Eike Heimpel. Small business
				according to § 19 UStG.
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
