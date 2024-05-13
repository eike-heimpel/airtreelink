<script>
	import { goto } from '$app/navigation';
	export let showAddButton = true; // Prop to control the visibility of the "+" button

	let entries = [
		{
			icon: '🛫',
			name: 'Plan your trip',
			link: '/plan-your-trip',
			color: 'from-orange-400 to-pink-500'
		},
		{
			icon: '📶',
			name: 'Connect to WiFi',
			link: '/connect-to-wifi',
			color: 'from-blue-400 to-blue-600'
		},
		{
			icon: '🔑',
			name: 'How to get in',
			link: '/how-to-get-in',
			color: 'from-green-400 to-green-600'
		},
		{ icon: '🎵', name: 'Play music', link: '/play-music', color: 'from-purple-400 to-purple-600' },
		{ icon: '☕', name: 'Make coffee', link: '/make-coffee', color: 'from-orange-400 to-pink-500' }
	];

	let newEntry = {
		icon: '🛫',
		name: '',
		link: '',
		color: 'from-gray-400 to-gray-500'
	};

	let showLinksModal = false;
	let selectedIcon = '🛫';

	const mockIcons = ['🛫', '📶', '🔑', '🎵', '☕', '📅', '🌐', '🔍', '📞'];

	const gradients = [
		'from-orange-400 to-pink-500',
		'from-blue-400 to-blue-600',
		'from-green-400 to-green-600',
		'from-purple-400 to-purple-600',
		'from-red-400 to-yellow-500',
		'from-teal-400 to-cyan-500'
	];

	function addEntry() {
		entries = [...entries, { ...newEntry, link: '/new-entry' }];
		newEntry = { icon: '', name: '', link: '', color: '' };
		showLinksModal = false;
	}

	function handleClick(link) {
		goto(link);
	}

	function toggleLinksModal() {
		if (!showLinksModal) {
			newEntry.color = gradients[Math.floor(Math.random() * gradients.length)];
			newEntry.icon = mockIcons[0];
		}
		showLinksModal = !showLinksModal;
	}

	function handleFormSubmit(event) {
		event.preventDefault();
		addEntry();
	}

	function selectIcon(icon) {
		newEntry.icon = icon;
		selectedIcon = icon;
	}
</script>

<div class="grid-container">
	{#each entries as entry}
		<button
			class={`grid-item bg-gradient-to-r ${entry.color}`}
			on:click={() => handleClick(entry.link)}
			on:keydown={(event) => {
				if (event.key === 'Enter') {
					handleClick(entry.link);
				}
			}}
		>
			<div class="icon-wrapper">
				<span class="icon">{entry.icon}</span>
			</div>
			<span class="item-text">{entry.name}</span>
		</button>
	{/each}
	{#if showAddButton}
		<button class="add-item" type="button" on:click={toggleLinksModal}>
			<span class="text-3xl">➕</span>
		</button>
	{/if}
</div>

{#if showLinksModal}
	<div class="modal modal-open">
		<div class="modal-box">
			<h2 class="font-bold text-lg">Add New Entry</h2>
			<form on:submit={handleFormSubmit}>
				<div class="form-control">
					<label class="label">Icon</label>
					<div class="flex flex-wrap gap-2">
						{#each mockIcons as icon}
							<div
								class={`cursor-pointer p-2 rounded ${selectedIcon === icon ? 'bg-gray-200' : ''}`}
								on:click={() => selectIcon(icon)}
							>
								<span class="text-2xl">{icon}</span>
							</div>
						{/each}
					</div>
				</div>
				<div class="form-control">
					<label class="label">Name</label>
					<input
						class="input input-bordered"
						type="text"
						bind:value={newEntry.name}
						placeholder="Enter name"
						required
					/>
				</div>
				<div class="form-control">
					<label class="label">Color Gradient</label>
					<input class="input input-bordered" type="text" bind:value={newEntry.color} readonly />
				</div>
				<div class="modal-action">
					<button type="button" class="btn" on:click={toggleLinksModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">Add</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.grid-container {
		@apply grid gap-4;
		grid-template-columns: repeat(2, 1fr);
	}

	.grid-item {
		@apply text-white rounded-lg p-4 flex flex-col justify-center items-center relative cursor-pointer;
		min-height: 120px;
	}

	.add-item {
		@apply border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer;
		min-height: 120px;
	}

	.icon-wrapper {
		@apply bg-white rounded-full p-2 absolute top-2 left-2 flex items-center justify-center;
		width: 32px; /* Adjust size */
		height: 32px; /* Adjust size */
	}

	.icon {
		@apply text-lg text-black; /* Adjust size */
	}

	.item-text {
		@apply mt-4 sm:mt-0 text-center sm:text-xl;
	}

	.modal-open .modal-box {
		display: block;
	}

	.modal {
		@apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50;
	}

	.modal-box {
		@apply bg-white rounded-lg p-8 shadow-lg;
		width: 90%;
		max-width: 500px;
	}

	.form-control {
		@apply mb-4;
	}

	.modal-action {
		@apply flex justify-end;
	}
</style>
