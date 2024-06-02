<script lang="ts">
	export let title: string;
	export let editMode: boolean;
	export let icon: string | null;
	import PlusIcon from 'virtual:icons/mdi/plus';

	import { iconMapping } from '$lib/listings/cards/cardIconMappings';

	let IconComponent: ConstructorOfATypedSvelteComponent;
	let showAsModal = false;
	let tooltipText = 'Select an icon';
	let iconComponents: Record<string, ConstructorOfATypedSvelteComponent> = {};

	async function loadIcon(iconName) {
		const icon = iconMapping[iconName];
		if (icon) {
			const module = await icon.importPath();
			IconComponent = module.default;
		} else {
			IconComponent = null;
		}
	}

	$: if (icon) {
		loadIcon(icon);
	}

	async function loadAllIcons() {
		for (const [iconName, icon] of Object.entries(iconMapping)) {
			if (!iconComponents[iconName]) {
				const module = await icon.importPath();
				iconComponents[iconName] = module.default;
			}
		}
	}

	function selectIcon(iconName) {
		icon = iconName;
		showAsModal = false;
		loadIcon(iconName); // Load the selected icon
	}

	$: if (showAsModal) {
		loadAllIcons(); // Load all icons when modal is shown
	}
</script>

{#if editMode}
	<div class="form-control">
		<h3 class="text-primary mb-2 text-xl text-left">Title</h3>
		<div class="flex items-center justify-center gap-4">
			<input type="text" class="input input-primary" bind:value={title} />
			<div>
				{#if IconComponent}
					<button
						class="flex items-center cursor-pointer {iconMapping[icon].bgColor} rounded-full p-1"
						on:click={() => (showAsModal = true)}
					>
						<svelte:component this={IconComponent} class="w-5 h-5" />
					</button>
				{:else}
					<button class="btn btn-outline" on:click={() => (showAsModal = true)}> Add Icon </button>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<h1 class="text-xl font-medium text-left drop-shadow-xl">{title}</h1>
	{#if IconComponent}
		<div class="flex items-center {iconMapping[icon].bgColor} rounded-full p-1">
			<svelte:component this={IconComponent} class="w-5 h-5" />
		</div>
	{/if}
{/if}

{#if showAsModal}
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={showAsModal}>
		<div class="modal-box">
			<div class="modal-body">
				<p class="mb-4">{tooltipText}</p>
				<div class="flex flex-wrap gap-4">
					{#each Object.entries(iconMapping) as [iconName, icon]}
						<button
							class="flex items-center justify-center cursor-pointer {icon.bgColor} rounded-full p-2"
							on:click={() => selectIcon(iconName)}
						>
							{#if iconComponents[iconName]}
								<svelte:component this={iconComponents[iconName]} class="w-8 h-8" />
							{:else}
								<span>Loading...</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
			<div class="modal-action">
				<button
					class="btn"
					on:click={() => {
						showAsModal = false;
					}}>Close</button
				>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop" on:click={() => (showAsModal = false)}>
			<button>close</button>
		</form>
	</dialog>
{/if}
