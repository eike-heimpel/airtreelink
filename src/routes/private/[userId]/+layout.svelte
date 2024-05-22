<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { editMode, showListingSettings, previewMode } from '$lib/stores/store';
	import ListingView from '$components/ListingView.svelte';
	import { fly, slide } from 'svelte/transition';

	export let data;

	let hostView = true;

	$: ({ session, supabase } = data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error logging out:', error.message);
	};

	let mobileMenuOpen = false;

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};

	function toggleEditMode() {
		if (session) {
			$editMode = !$editMode;
		} else {
			console.log('unauthorized attempt to edit listing by user');
		}
	}

	function openSettingsModal() {
		if (session) {
			$showListingSettings = true;
		} else {
			console.log('unauthorized attempt to show settings by user');
		}
	}

	function startPreviewMode() {
		console.log('Preview mode started');
		$previewMode = true;
	}

	$: console.log($previewMode);
</script>

<div
	class="fixed top-0 left-0 w-full h-[1px] md:h-[2px] bg-primary transform scale-x-0 transition-transform duration-1000 ease-out"
	class:scale-x-100={$navigating}
></div>

<div class="flex flex-col md:flex-row min-h-screen relative overflow-hidden">
	{#if !$previewMode}
		<div>
			<!-- Mobile menu button and action buttons for mobile -->
			<div class="flex items-center justify-between md:hidden p-4 z-50">
				<button class="focus:outline-none" on:click={() => (mobileMenuOpen = !mobileMenuOpen)}>
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
				<!-- Action buttons -->
				{#if !$page.url.pathname.endsWith('/listings')}
					<button class="btn btn-sm btn-outline ml-1" on:click={startPreviewMode}>Preview</button>

					<button class="btn btn-sm btn-outline ml-1" on:click={openSettingsModal}>Settings</button>
					<button
						class="btn btn-sm btn-{$editMode ? 'secondary' : 'primary'} ml-1"
						on:click={toggleEditMode}
					>
						{$editMode ? 'Stop' : 'Start'} Editing
					</button>
				{/if}
			</div>

			<!-- Navigation menu -->
			<nav
				class={`navbar bg-base-200 shadow-xl w-full md:w-56 md:block ${mobileMenuOpen ? 'block absolute top-12 left-0 z-40 h-[calc(100vh-3rem)] flex flex-col items-center justify-start' : 'hidden'}`}
			>
				<a href="/" class="w-full flex justify-center" on:click={closeMobileMenu}>
					<img src="/logo.webp" alt="Logo" class="w-16 mx-auto mt-4 mb-6" />
				</a>
				<ul class="menu gap-4 md:text-lg flex-col items-center w-full p-4 md:p-0">
					<li
						class={`rounded-lg ${$page.url.pathname.endsWith('/account') ? 'bg-neutral text-white' : ''}`}
					>
						<a
							href="/private/{$page.params.userId}/account"
							class="flex items-center text-xl py-4 w-full justify-center"
							on:click={closeMobileMenu}
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
					>
						<a
							href="/private/{$page.params.userId}/listings"
							class="flex items-center text-xl py-4 w-full justify-center"
							on:click={closeMobileMenu}
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
					>
						<a
							href="/private/{$page.params.userId}/subscription"
							class="flex items-center text-xl py-4 w-full justify-center"
							on:click={closeMobileMenu}
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
					<li class="mt-4">
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
				<!-- Action buttons for desktop -->
				{#if !$page.url.pathname.endsWith('/listings')}
					<div class="hidden md:flex flex-col items-center justify-around w-full mt-4 h-48">
						<button class="btn btn-outline mb-2" on:click={startPreviewMode}>Preview</button>

						<button class="btn btn-outline mb-2" on:click={openSettingsModal}>Settings</button>
						<button class="btn btn-{$editMode ? 'secondary' : 'primary'}" on:click={toggleEditMode}>
							{$editMode ? 'Stop' : 'Start'} Editing
						</button>
					</div>
				{/if}
			</nav>
		</div>
	{:else}
		<button
			class="btn btn-circle btn-info btn-sm md:btn-md btn-outline fixed top-2 left-2"
			type="button"
			on:click={() => {
				$previewMode = false;
			}}
		>
			X
		</button>
	{/if}
	<!-- Content area -->
	<div class="flex-1">
		<slot></slot>
	</div>
</div>
