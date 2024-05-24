<script>
	import { goto } from '$app/navigation';
	import { editMode } from '$lib/stores/store';

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

	let showAddModal = false;
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

	function openAddModal() {
		newEntry.color = gradients[Math.floor(Math.random() * gradients.length)];
		newEntry.icon = mockIcons[0];
		showAddModal = true;
	}

	function addEntry() {
		entries = [...entries, { ...newEntry, link: '/new-entry' }];
		newEntry = { icon: '', name: '', link: '', color: '' };
		showAddModal = false;
	}

	function handleClick(link) {
		goto(link);
	}

	function selectIcon(icon) {
		newEntry.icon = icon;
		selectedIcon = icon;
	}
</script>

<div class="container mx-auto px-4 py-8">
	{#if $editMode}
		<button class="btn btn-secondary mb-4 ml-2" on:click={openAddModal}>Add Link</button>
	{/if}
	<div class="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
		{#each entries as entry}
			<button
				class={`text-white rounded-lg p-4 flex flex-col justify-center items-center relative cursor-pointer min-h-[120px] bg-gradient-to-r ${entry.color}`}
				on:click={() => handleClick(entry.link)}
				on:keydown={(event) => {
					if (event.key === 'Enter') {
						handleClick(entry.link);
					}
				}}
			>
				<div
					class="bg-white rounded-full p-2 absolute top-2 left-2 flex items-center justify-center w-[32px] h-[32px]"
				>
					<span class="text-lg text-black">{entry.icon}</span>
				</div>
				<span class="mt-4 text-center text-sm">{entry.name}</span>
			</button>
		{/each}
	</div>

	{#if showAddModal}
		<div class="modal modal-open modal-bottom sm:modal-middle">
			<div class="modal-box">
				<h3 class="font-bold text-lg">Add New Entry</h3>
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
					<button class="btn btn-primary" on:click={addEntry}>Add</button>
					<button class="btn" on:click={() => (showAddModal = false)}>Cancel</button>
				</div>
			</div>
		</div>
	{/if}
</div>
