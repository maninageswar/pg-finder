<script>
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { listOfRents } from '$lib/utils/sharedlogic';
    import * as amenityIcons from '$lib/svg';
    import CloseWhite from '$lib/svg/CloseWhite.svelte';
    import FavoriteWhiteLine from '$lib/svg/FavoriteWhiteLine.svelte';

    let { property, cardTopRightIcon = "noIcon", removePropertyFromFvaorites } = $props();

    let pgRents = listOfRents(property);
</script>

<div class="border border-gray-200 rounded-xl w-full h-35 cursor-pointer flex relative">
    {#if cardTopRightIcon != "noIcon"}
        <button class="absolute bg-pg-card-action-element-bgcolor hover:cursor-pointer opacity-35 size-5 rounded-full right-2 top-2 flex items-center justify-center p-0.5 z-10"
            onclick={(e)=>{
                e.stopPropagation();   // stops card click
                e.preventDefault();   // stops anchor navigation
                removePropertyFromFvaorites();
                }}>
            {#if cardTopRightIcon == "close"}
                <CloseWhite/>
            {:else}
                <FavoriteWhiteLine/>
            {/if}
        </button>
    {/if}
    {#if property.pgImages.length > 0}
        <img src="{PUBLIC_POCKETBASE_REST_API}/files/{property.collectionId}/{property.id}/{property.pgImages[0]}" alt="pg" class="w-[40%] h-full rounded-l-xl object-cover"/>
    {:else}
        <img src="/icons/hostel.svg" alt="pg" class="w-[40%] h-full rounded-l-xl bg-favorite-page-default-image-bgcolor"/>
    {/if}
    <div class="p-2 flex flex-col justify-between w-[60%]">
        <div class="font-Manrope truncate text-xl font-semibold">{property.pgName}</div>
        <div class="text-pg-sky font-Manrope text-l font-semibold">&#8377;{pgRents[pgRents.length-1]}/m<span class="italic text-pg-sky-text text-sm"> ( starting price )</span></div>

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