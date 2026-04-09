<script>
	let { showModal = $bindable(), title, description,  buttonTitle, formaction } = $props();

	let dialog = $state();

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
	<div>
		<h3 class="mb-1 font-Manrope">{title || 'Default Title'}</h3>
        <p class="text-pg-sky-text text-justify">{description || 'Default Description'}</p>
        <div class="flex items-center justify-end gap-2 mt-3">
            <button class="bg-pg-red-button text-white px-4 py-2 rounded-md cursor-pointer basis-1/2"
                onclick={() => dialog.close()}
                formaction={formaction || ''}>{buttonTitle || 'yes'}
            </button>
            <!-- svelte-ignore a11y_autofocus -->
            <button class="pg-sky-button basis-1/2" autofocus onclick={() => dialog.close()}>cancel</button>
        </div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 1rem;
		border: none;
		padding: 0;
		margin: auto;
		inset: 0;
		position: fixed;
		overflow: hidden;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1.5rem;
        width: 350px;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
