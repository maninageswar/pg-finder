<script>
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { listOfRents } from '$lib/utils/sharedlogic';
    import CloseWhite from '$lib/svg/CloseWhite.svelte';
    import FavoriteWhiteLine from '$lib/svg/FavoriteWhiteLine.svelte';
    import * as amenityIcons from '$lib/svg';

    let { property, cardTopRightIcon = "noIcon", removePropertyFromFvaorites } = $props();

    let pgRents = listOfRents(property);
</script>

<div class="rounded-xl h-78 border border-gray-200 cursor-pointer relative">
    {#if cardTopRightIcon != "noIcon"}
        <button class="absolute bg-pg-card-action-element-bgcolor hover:cursor-pointer opacity-35 size-6.5 rounded-full right-2 top-2 flex items-center justify-center p-0.5"
            onclick={(e)=>{
                e.stopPropagation();   // stops card click
                e.preventDefault();   // stops anchor navigation
                removePropertyFromFvaorites();
                }}>
            {#if cardTopRightIcon == "close"}
                <CloseWhite color="#FFFFFF"/>
            {:else}
                <FavoriteWhiteLine color="#FFFFFF"/>
            {/if}
        </button>
    {/if}
    <div class="w-full h-[55%]">
        {#if property.pgImages.length > 0}
            <img src="{PUBLIC_POCKETBASE_REST_API}/files/{property.collectionId}/{property.id}/{property.pgImages[0]}" alt="pg" class="w-full h-full rounded-t-xl object-cover "/>
        {:else}
            <img src="/icons/hostel.svg" alt="pg" class="w-full h-full rounded-t-xl object-cover bg-favorite-page-default-image-bgcolor"/>
        {/if}
        
    </div>

    <div class="p-3 flex flex-col justify-between h-[45%]">
        <div class="w-full flex gap-1">
            <div class="font-Manrope truncate text-xl font-semibold">{property.pgName}</div>
            <div class="text-pg-sky font-Manrope w-[136px] text-xl font-semibold">&#8377;{pgRents[pgRents.length-1]}/month</div>
        </div>
        
        <div class="w-full">
            <h3 class="font-Manrope mr-2 inline">rating:</h3>
            <span class="text-yellow-400">&#9733; &#9733; &#9733; &#9733; &#9734;</span>
        </div>

        <p class="text-pg-sky-text truncate">{property.pgAddress.toLowerCase()}</p>

        <div class="w-full [&>*:not(:last-child)]:mr-1 truncate text-pg-sky showAmenitiesInOneLine">
            {#each property.pgAmenities as pgAmenitie}
                {#if amenityIcons[pgAmenitie]}
                    <svelte:component this={amenityIcons[pgAmenitie]} />
                {:else}
                    <svelte:component this={amenityIcons["defaultAmenity"]} />
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .showAmenitiesInOneLine :global(svg) {
        display: inline;
    }
</style>