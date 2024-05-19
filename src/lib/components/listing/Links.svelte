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

<div class="grid gap-4 grid-cols-2">
	{#each entries as entry}
		<div
			class={`text-white rounded-lg p-4 flex flex-col justify-center items-center relative cursor-pointer min-h-[120px] bg-gradient-to-r ${entry.color}`}
			on:click={() => handleClick(entry.link)}
		>
			<div
				class="bg-white rounded-full p-2 absolute top-2 left-2 flex items-center justify-center w-[32px] h-[32px]"
			>
				<span class="text-lg text-black">{entry.icon}</span>
			</div>
			<span class="mt-4 text-center text-sm">{entry.name}</span>
		</div>
	{/each}
	{#if showAddButton}
		<div
			class="border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer min-h-[120px]"
			on:click={toggleLinksModal}
		>
			<span class="text-3xl">➕</span>
		</div>
	{/if}
</div>

{#if showLinksModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<div class="bg-base-100 rounded-lg p-8 shadow-lg w-[90%] max-w-[500px]">
			<h2 class="font-bold text-lg">Add New Entry</h2>
			<form on:submit={handleFormSubmit}>
				<div class="mb-4">
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
				<div class="mb-4">
					<label class="label">Name</label>
					<input
						class="input input-bordered"
						type="text"
						bind:value={newEntry.name}
						placeholder="Enter name"
						required
					/>
				</div>
				<div class="mb-4">
					<label class="label">Color Gradient</label>
					<input class="input input-bordered" type="text" bind:value={newEntry.color} readonly />
				</div>
				<div class="flex justify-end gap-2">
					<button type="button" class="btn btn-outline" on:click={toggleLinksModal}>Cancel</button>
					<button type="submit" class="btn btn-primary">Add</button>
				</div>
			</form>
		</div>
	</div>
{/if}
