<script>
    import { slide } from 'svelte/transition';

    let { title, children, isOpen = false } = $props();
</script>

<div class="border border-pg-sky rounded-xl overflow-hidden">
    <button type="button"
        class="w-full flex items-center justify-between p-4 cursor-pointer"
        onclick={() => isOpen = !isOpen}
    >
        <h2 class="text-base font-medium text-black">{@html title}</h2>
        <svg
            class="w-5 h-5 transition-transform duration-300 text-pg-sky {isOpen ? 'rotate-180' : ''}"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {#if isOpen}
        <div transition:slide={{ duration: 300 }}>
            <hr class="mx-4 border border-pg-sky-button-disabled"/>
            <div class="px-4 pb-4 pt-3">
                {@render children()}
            </div>
        </div>
    {/if}
</div>
