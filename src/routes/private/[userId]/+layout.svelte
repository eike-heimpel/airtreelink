<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { editMode, showListingSettings, previewMode } from '$lib/stores/store';

	import AccountCircleOutline from 'virtual:icons/mdi/account-circle-outline';
	import FormatListBulleted from 'virtual:icons/mdi/format-list-bulleted';
	import CardMembership from 'virtual:icons/mdi/card-membership';
	import LogoutVariant from 'virtual:icons/mdi/logout-variant';
	import SettingsOutline from 'virtual:icons/mdi/settings-outline';
	import EyeOutline from 'virtual:icons/mdi/eye-outline';
	import PencilOutline from 'virtual:icons/mdi/pencil-outline';
	import { invalidate, invalidateAll } from '$app/navigation';

	export let data;

	$: ({ session, supabase } = data);

	const logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) console.error('Error logging out:', error.message);
	};

	let mobileMenuOpen = false;
	let confirmModalOpen = false;

	const closeMobileMenu = () => {
		mobileMenuOpen = false;
	};

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
</script>

<div
	class="fixed top-0 left-0 w-full h-[2px] md:h-[4px] bg-primary transform scale-x-0 transition-transform duration-1000 ease-out"
	class:scale-x-100={$navigating}
></div>

<div class="flex flex-col md:flex-row min-h-screen relative">
	{#if !$previewMode}
		<!-- Mobile menu button and action buttons for mobile -->
		<div
			class="flex items-center justify-around md:hidden p-2 fixed top-0 left-0 w-full z-50 bg-base-100"
		>
			<button class="btn btn-circle btn-ghost swap swap-rotate">
				<!-- this hidden checkbox controls the state -->
				<input type="checkbox" bind:checked={mobileMenuOpen} />
				<!-- hamburger icon -->
				<svg
					class="swap-off fill-current"
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 512 512"
					><path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" /></svg
				>
				<!-- close icon -->
				<svg
					class="swap-on fill-current"
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 512 512"
					><polygon
						points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
					/></svg
				>
			</button>
			<!-- Action buttons -->
			{#if $page.params.listingId !== undefined}
				<button
					class="btn btn-sm btn-outline ml-1"
					aria-label="Preview"
					on:click={startPreviewMode}
				>
					<EyeOutline class="h-6 w-6" />
				</button>
				<button
					class="btn btn-sm btn-outline ml-1"
					aria-label="Settings"
					on:click={openSettingsModal}
				>
					<SettingsOutline class="h-6 w-6" />
				</button>
			{/if}
		</div>

		<!-- Navigation menu -->
		<nav
			class={`navbar bg-base-100 shadow-xl w-full md:w-56 md:block fixed md:static top-12 md:top-0 left-0 z-40 ${mobileMenuOpen ? 'block h-full' : 'hidden'} md:block`}
		>
			<a href="/" class="w-full flex justify-center" on:click={closeMobileMenu}>
				<img src="/logo_black.png" alt="Logo" class="w-16 mx-auto mt-4 mb-6" />
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
						<AccountCircleOutline class="w-6 h-6 mr-2" />
						<span class=" md:inline">Profile</span>
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
						<FormatListBulleted class="w-6 h-6 mr-2" />
						<span class=" md:inline">Listings</span>
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
						<CardMembership class="w-6 h-6 mr-2" />
						<span class=" md:inline">Subscription</span>
					</a>
				</li>
				<li class="mt-4">
					<button
						class="btn btn-outline flex items-center text-xl w-full justify-center"
						on:click={logout}
					>
						<LogoutVariant class="w-6 h-6 mr-2" />
						<span class=" md:inline">Sign Out</span>
					</button>
				</li>
			</ul>
			<!-- Action buttons for desktop -->
			{#if $page.params.listingId !== undefined}
				<div class="hidden md:flex flex-col items-center justify-around w-full mt-4 h-48">
					<button
						class="btn btn-outline mb-2 flex items-center"
						aria-label="Preview"
						on:click={startPreviewMode}
					>
						<EyeOutline class="w-6 h-6 mr-2" />
						<span>Preview</span>
					</button>
					<button
						class="btn btn-outline mb-2 flex items-center"
						aria-label="Settings"
						on:click={openSettingsModal}
					>
						<SettingsOutline class="w-6 h-6 mr-2" />
						<span>Settings</span>
					</button>
				</div>
			{/if}
		</nav>
	{:else}
		<button
			class="btn btn-circle btn-accent btn-md md:btn-md btn-outline fixed top-2 left-2 z-20"
			type="button"
			on:click={() => {
				$previewMode = false;
			}}
		>
			<EyeOutline class="h-6 w-6" />
		</button>
	{/if}
	<!-- Content area -->
	<div class="flex-1">
		<slot></slot>
	</div>
</div>
