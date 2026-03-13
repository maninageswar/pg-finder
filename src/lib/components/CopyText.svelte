<script>
    let { text } = $props();
    let copied = $state(false);

    async function copyText() {
        await navigator.clipboard.writeText(text);
        copied = true;
        setTimeout(() => copied = false, 2000);
    }
</script>

<button type="button" class="cursor-pointer" onclick={copyText}>
    {#if copied}
        <svg class="w-5 h-5 text-pg-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" />
        </svg>
    {:else}
        <svg class="w-5 h-5 text-pg-sky" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    {/if}
</button>
