<script>
    import { enhance } from '$app/forms';
    import FavoriteCard from '$lib/components/cards/FavoriteCard.svelte';
    import InfoToolTip from "$lib/components/InfoToolTip.svelte";

    let { data } = $props();

    let favoritePgsParentElement;
    let showToolTip = $state(true);

    setTimeout(() => {
        showToolTip = false
    }, 1000);

</script>

<svelte:window onclick={(e)=> {
    if (showToolTip === true && !e.srcElement.classList.contains("infoIcon")) {
        e.preventDefault
        showToolTip = false
    } 
    }} />

<div class="flex justify-between gap-2 mb-5">
    <h2 class="font-Manrope mb-2">your favorite properties</h2>
    <InfoToolTip {showToolTip} toltipClass="right-0 min-w-[22rem] max-w-[25rem]"
                info="if you notice that any property is missing from your favorites, it may be because the owner of that property has exited the application and deleted it from the system" />
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
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
        <img src="/icons/noFavorites.svg" class="w-[400px] h-[300px]" alt="noFavorites">
        <p class="font-Manrope text-pg-sky-text text-center">you don't have any pg's in your favorites. start exploring and add to your favorites <a class="font-bold text-pg-sky underline" href="/">here.</a></p>
    </div>
{/if}

