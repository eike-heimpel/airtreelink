<script lang="ts">
	import { iconMapping } from '$lib/listings/cards/cardIconMappings';
	import PlusIcon from 'virtual:icons/mdi/plus';

	export let title: string;
	export let editMode: boolean;
	export let icon: string | null;

	let showAsModal = false;
	let tooltipText = 'Select an icon';

	function selectIcon(iconName: string) {
		icon = iconName;
		showAsModal = false;
	}
</script>

{#if editMode}
	<div class="form-control">
		<h3 class="text-primary mb-2 text-xl text-left">Title</h3>
		<div class="flex items-center justify-center gap-4">
			<input type="text" class="input input-primary" bind:value={title} />
			<div>
				{#if iconMapping[icon]?.component}
					<button
						class="flex items-center cursor-pointer {iconMapping[icon].bgColor} rounded-full p-1"
						on:click={() => (showAsModal = true)}
					>
						<svelte:component this={iconMapping[icon].component} class="w-5 h-5" />
					</button>
				{:else}
					<button class="btn btn-outline" on:click={() => (showAsModal = true)}><PlusIcon /></button
					>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<h1 class="text-xl font-medium text-left drop-shadow-xl">{title}</h1>
	{#if iconMapping[icon]?.component}
		<div class="flex items-center {iconMapping[icon].bgColor} rounded-full p-1">
			<svelte:component this={iconMapping[icon].component} class="w-5 h-5" />
		</div>
	{/if}
{/if}

{#if showAsModal}
	<dialog class="modal modal-bottom sm:modal-middle" class:modal-open={showAsModal}>
		<div class="modal-box">
			<div class="modal-body">
				<p class="mb-4">{tooltipText}</p>
				<div class="flex flex-wrap gap-4">
					{#each Object.entries(iconMapping) as [iconName, icon] (iconName)}
						<button
							class="flex items-center gap-2 cursor-pointer {icon.bgColor} rounded-full p-2"
							on:click={() => selectIcon(iconName)}
						>
							<svelte:component this={icon.component} class="w-5 h-5" />

							<span>{icon.name}</span>
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
