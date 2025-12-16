<script>
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { listOfRents } from '$lib/utils/sharedlogic';

    let { property, cardTopRightIcon = "noIcon", removePropertyFromFvaorites } = $props();

    let pgRents = listOfRents(property);
</script>

<div class="rounded-xl h-78 shadow-xl cursor-pointer relative">
    {#if cardTopRightIcon != "noIcon"}
        <button class="absolute bg-pg-card-action-element-bgcolor hover:cursor-pointer opacity-35 size-6.5 rounded-full right-2 top-2 flex items-center justify-center p-0.5 z-10"
            onclick={(e)=>{
                e.stopPropagation();   // stops card click
                e.preventDefault();   // stops anchor navigation
                removePropertyFromFvaorites();
                }}>
            <img src="/icons/{cardTopRightIcon == "close" ? "closeWhite" : "favoriteWhiteLine"}.svg" alt="close icon">
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

        <div class="w-full inline [&>*:not(:last-child)]:mr-2 truncate text-pg-sky ">
            {#each property.pgAmenities as pgAmenitie}
                <img src="/icons/{pgAmenitie}.svg" alt="pg amenity icon" class="inline"/>
            {/each}
        </div>
    </div>
</div>