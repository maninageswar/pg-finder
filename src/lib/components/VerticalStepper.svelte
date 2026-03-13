<script>
    import CopyText from '$lib/components/CopyText.svelte';
    
    let { steps = [] } = $props();
</script>

<div class="flex flex-col ">
    {#each steps as step, i}
        <div class="flex gap-3">
            <div class="flex flex-col items-center">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shrink-0 bg-white text-pg-sky border-2 border-pg-sky-button-disabled">
                    {i + 1}
                </div>
                {#if i < steps.length - 1}
                    <div class="w-0.5 grow min-h-8 bg-pg-sky-button-disabled"></div>
                {/if}
            </div>
            <div class="pb-6">
                <p class="text-base font-medium text-black">
                    {@html step.title}
                    {#if step.copyText}
                        <CopyText text={step.copyText} />
                    {/if}
                </p>
                {#if step.description}
                    <p class="text-sm text-pg-sky-text mt-1 text-justify">{@html step.description}</p>
                {/if}
            </div>
        </div>
    {/each}
</div>
