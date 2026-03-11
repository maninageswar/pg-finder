<script>
    import { enhance } from '$app/forms';
    import FavoriteCard from '$lib/components/cards/FavoriteCard.svelte';

    let { data } = $props();

    let favoritePgsParentElement;
    let showToolTip = $state(false);
</script>

<svelte:window onclick={(e)=> {
    if (showToolTip === true && !e.srcElement.classList.contains("infoIcon")) {
        e.preventDefault
        showToolTip = false
    } 
    }} />

<div class="flex justify-between gap-2 mb-5">
    <h2 class="font-Manrope mb-2">your favorite properties</h2>
    <button class="relative group cursor-pointer text-base infoIcon" onclick={()=> {showToolTip = !showToolTip}}><span class="font-bold text-pg-sky text-lg infoIcon">&#9432;</span>
        <span class="absolute  mt-2 right-0
                    min-w-[22rem] max-w-[25rem]
                    group-hover:block {showToolTip ? 'block' : 'hidden'}
                    whitespace-normal break-words
                    rounded p-1 bg-white
                    text-xs leading-relaxed
                    text-pg-sky border border-pg-sky shadow-lg z-10">
            if you notice that any property is missing from your favorites, it may be because the owner of that property has exited the application and deleted it from the system
        </span>
    </button>
</div>

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

