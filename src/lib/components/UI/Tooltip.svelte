<script lang="ts">
	import InformationOutline from 'virtual:icons/mdi/information-outline';

	export let tooltipText = '';
	let showAsModal = false;
</script>

<button
	class="md:tooltip"
	data-tip={tooltipText}
	on:click={() => {
		showAsModal = !showAsModal;
	}}
>
	<InformationOutline />
</button>

{#if showAsModal}
	<dialog class="modal modal-bottom md:hidden" class:modal-open={showAsModal}>
		<div class="modal-box">
			<div class="modal-body">
				<p>{tooltipText}</p>
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
		<form method="dialog" class="modal-backdrop">
			<button on:click={() => (showAsModal = false)}>close</button>
		</form>
	</dialog>
{/if}
