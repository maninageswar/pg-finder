<script>
    import { enhance } from '$app/forms';
    import FavoriteCard from '$lib/components/cards/FavoriteCard.svelte';

    let { data } = $props();

    let favoritePgsParentElement;  
</script>

<h2 class="font-Manrope mb-5">your favorite properties</h2>

{#if data.userFavoritesProperties.length > 0}
    <div class="favoritesPgs" bind:this={favoritePgsParentElement}>
        {#each data.userFavoritesProperties as property}
            <form method="POST" id={property.id} action={`/pgProperty/${property.id}?/removeInventoryFromFavorites`} use:enhance>
                <a class="mb-4 block" href="{`/pgProperty/${property.id}`}">
                    <FavoriteCard {property} cardTopRightIcon={"close"}
                        removePropertyFromFvaorites={()=>{
                            for (let formElement of favoritePgsParentElement.children) {
                                if(formElement.id == property.id){
                                    formElement.requestSubmit()}
                            }
                        }}
                    />
                </a>
            </form>
        {/each}
    </div>
{:else}
    <img src="/icons/noFavorites.svg" class="w-[400px] h-[300px]" alt="noFavorites">
    <p class="font-Manrope text-pg-sky-text text-center">you don't have any pg's in your favorites. start exploring and add to your favorites <a class="font-bold text-pg-sky underline" href="/">here.</a></p>
{/if}

