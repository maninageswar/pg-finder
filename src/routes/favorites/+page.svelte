<script>
    import { enhance } from '$app/forms';
    import FavoriteCard from '$lib/components/cards/FavoriteCard.svelte';

    let { data } = $props();
</script>

<h2 class="font-Manrope mb-5">your favorite pg's</h2>

{#if data.userFavoritesProperties.length > 0}
    {#each data.userFavoritesProperties as property}
        <form method="POST" id={property.id} action={`/pgProperty/${property.id}?/removeInventoryFromFavorites`} use:enhance>
            <a class="mb-4 block" href="{`/pgProperty/${property.id}`}">
                <FavoriteCard property = {property} cardTopRightIcon={"close"}
                    removePropertyFromFvaorites={()=>{
                        // TODO: don't use document.getElementById, try to use any other way to submit the form
                        document.getElementById(property.id).requestSubmit()
                    }}
                />
            </a>
        </form>
    {/each}
{:else}
    <img src="/icons/noFavorites.svg" class="w-[400px] h-[300px]" alt="noFavorites">
    <p class="font-Manrope text-pg-sky-text text-center">you don't have any pg's in your favorites. start exploring and add to your favorites <a class="font-bold text-pg-sky underline" href="/">here.</a></p>
{/if}

