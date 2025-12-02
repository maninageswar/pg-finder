<script>
    import { goto } from '$app/navigation';
    let { data } = $props();
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import FavoriteCard from '$lib/components/cards/FavoriteCard.svelte';
</script>

<h2 class="font-Manrope mb-5">your favorite pg's</h2>

{#if data.userFavoritesProperties.length > 0}
    {#each data.userFavoritesProperties as property}
        <a class="mb-4 block" href="{`/pgProperty/${property.id}`}">
            <FavoriteCard {property}/>
        </a>
    {/each}
{:else}
    <img src="/icons/noFavorites.svg" class="w-[400px] h-[300px]" alt="noFavorites">
    <p class="font-Manrope text-pg-sky-text text-center">you don't have any favorite pg's added yet. start exploring and add your favorites <a class="font-bold text-pg-sky underline" href="/">here.</a></p>
{/if}

