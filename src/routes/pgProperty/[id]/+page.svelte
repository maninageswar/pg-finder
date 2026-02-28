<script>
    import { PUBLIC_GOOGLE_MAP_API_KEY, PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { goto } from "$app/navigation";
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import * as gmapsLoader from '@googlemaps/js-api-loader';
    const { Loader } = gmapsLoader;
    import { failure, success, warning } from '$lib/notification'

    let { data } = $props();
    let mapElement;
    let row;
    let windowWidth = $state(0)
    console.log('data.pgProperty',data.pgProperty)
    let isInventoryInFavorites = $state(data.isInventoryInFavorites);

    const pgAmenitiesLabels = {
        studyTableChair: "study table & chair",
        cupboardWardrobe: "cupboard/wardrobe",
        geyserHotWater: "geyser/hot water",
        refrigerator: "refrigerator",
        threeMeals: "3 meals a day",
        roomCleaning: "room cleaning",
        washingMachines: "washing machines",
        wifi: "high speed wi-fi",
        commonTv: "common tv",
        cctvSurveillance: "cctv surveillance",
        biometricEntry: "biometric entry",
        parkingSpace: "parking space",
        airConditioning: "air conditioning",
        gymFitnessArea: "gym/fitness area",
        indoorGames: "indoor games",
        liftAvaliability: "lift/elevator",
        powerBackup: "power backup",
        commonKitchen: "common kitchen",
        roWater: "ro water"
    }

    onMount(() => {
        const loader = new Loader({
            apiKey: PUBLIC_GOOGLE_MAP_API_KEY,
            version: "weekly",
        });

        let map;
        loader.load().then(async () => {
            const { Map } = await google.maps.importLibrary("maps");
        
            map = new Map(mapElement, {
            center: { lat: 12.9517943, lng: 77.6985907 },
            zoom: 17,
            });

        });
    });

    function handlePropertyActions() {
        return async ({ result }) => {
            if (result.data?.notLoggedIn) {
                warning(result.data?.notLoggedIn);
                goto('/auth/login');
            }
            if (result.data?.removedInventoryFromFavorites) {
                success(result.data?.removedInventoryFromFavorites);
            }
            if (result.data?.addedInventoryToFavorites) {
                success(result.data?.addedInventoryToFavorites);
            }
            if (result.data?.inventoryExistsInFavorites) {
                warning(result.data?.inventoryExistsInFavorites);
            }
            if (result.data?.propertyDeleted) {
                success(result.data?.propertyDeleted);
                goto('/');
            }
            if (result.data?.deleteInventory) {
                failure(result.data?.deleteInventory);
            }
        }
    }

    function scrollLeft() {
        row.scrollBy({ left: -370, behavior: "smooth" });
    }

    function scrollRight() {
        row.scrollBy({ left: 370, behavior: "smooth" });
    }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<form method="POST" use:enhance={handlePropertyActions}>
    <div class="flex items-center justify-between mb-5">
        <h2 class="font-Manrope">pg information</h2>
        {#if data.isCurrentUserOwner}
            <button class="cursor-pointer bg-pg-red-button rounded-md p-1" onclick={() => deleteProperty(data.pgProperty.id)}
                formaction="?/deleteInventory">
                <img src="/icons/delete.svg" alt="delete icon"/>
            </button>
        {:else}
            <button class="cursor-pointer"
                onclick={() => isInventoryInFavorites = !isInventoryInFavorites}
                formaction="?/{!isInventoryInFavorites ? 'removeInventoryFromFavorites' : 'addInventoryToFavorites'}"
            >
                <img src="/icons/{isInventoryInFavorites ? "favoriteFilled" : "favoriteLine"}.svg" alt="favorite Icon" height="27px" width="27px"/>
            </button>
        {/if}
    </div>
</form>

<div class="relative w-full">
    <div class="flex gap-4 overflow-x-auto scroll-smooth py-2 no-scrollbar" bind:this={row}>
        {#if data.pgProperty.pgImages.length > 0}
            {#each data.pgProperty.pgImages as pgImage}
            <div class="w-[85%] h-[176px] rounded-md overflow-hidden bg-gray-800 flex-shrink-0 shadow-md">
                <img src="{PUBLIC_POCKETBASE_REST_API}/files/{data.pgProperty.collectionId}/{data.pgProperty.id}/{pgImage}" 
                    alt="pg" class="w-full h-full object-cover"/>
            </div>
            {/each}
        {:else}
            <div class="w-[100%] h-[176px] rounded-md overflow-hidden flex-shrink-0 shadow-md">
                <img src="/icons/hostel.svg" 
                    alt="pg" class="w-full h-full object-cover bg-favorite-page-default-image-bgcolor"/>
            </div>
        {/if}
        
    </div>

    {#if windowWidth > 1024}
        <div class="flex justify-end">
            <button onclick={scrollLeft}><img src="/icons/leftArrow.svg" alt="left-arrow"></button>
            <button onclick={scrollRight}><img src="/icons/rightArrow.svg" alt="right-arrow"></button>
        </div>
    {/if}
</div>


<div class={windowWidth < 1024 ? "mt-3" : ""}>
    <p class="text-base font-medium leading-normal line-clamp-1">name</p>
    <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">{data.pgProperty.pgName}</p>
</div>

<div class="mt-3">
    <p class="text-base font-medium leading-normal line-clamp-1">type</p>
    <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">pg for {data.pgProperty.pgType}</p>
</div>

<div class="mt-3">
    <p class="text-base font-medium leading-normal line-clamp-1">deposite amount</p>
    <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">&#8377;{data.pgProperty.pgDepositAmount} <span class="italic">( &#8377;{data.pgProperty.pgRefundableDeposit} refundable )</span></p>
</div>

<div class="mt-3">
    <p class="text-base font-medium leading-normal line-clamp-1">location</p>
    <div class="flex items-center justify-between">
        <p class="text-pg-sky-text text-sm font-normal basis-[90%] lowercase">{data.pgProperty.pgAddress}, {data.pgProperty.pgLandmark}, {data.pgProperty.pgCity}, {data.pgProperty.pgState} {data.pgProperty.pgPincode}.</p>
        <img src="/icons/location.svg" alt="Location Icon" />
    </div>
</div>


<div class="mt-3 w-full h-60 rounded overflow-hidden shadow" bind:this={mapElement} id="map"></div>


<h2 class="mt-5 mb-5 font-Manrope">rooms types & pricing</h2>


<div class="mt-3 grid grid-cols-2 gap-3 *:border *:border-pg-sky *:h-[170px] *:rounded-xl *:shadow-sm">
    {#each data.pgProperty.pgRoomTypes as roomType}
        <div class="p-4">
            <img src="/icons/bed.svg" alt="bed icon" class="w-[45px] h-[45px] mb-1" />
            <div class="flex flex-col justify-between h-[65%]">
                 <h2 class="text-base font-bold leading-tight ">{roomType}</h2>
                <p class="text-pg-sky-text text-sm font-normal leading-normal">&#8377;{data.pgProperty[`${roomType.replace(' ', '')}Rent`]}/month</p>
                <p class="text-pg-sky-text text-sm font-normal leading-normal">&#8377;{data.pgProperty[`${roomType.replace(' ', '')}PerDayRent`]}/day <span class="italic">(for days stay)</span></p>
                <p class="text-pg-sky-text text-sm font-normal leading-normal">{Object.entries(data.pgProperty[`${roomType.replace(' ', '')}AvailableRooms`]).reduce((acc, curr) => acc + (curr[1] > 0 ? curr[1] : 0), 0)} 
                    beds available</p>
            </div>
        </div>
    {/each}
</div>

<h2 class="mt-5 mb-5 font-Manrope">pg amenities</h2>

<div class="mt-3 grid grid-cols-2 gap-3 *:border *:border-pg-sky *:h-[60px] *:rounded-xl *:shadow-sm">
    {#each data.pgProperty.pgAmenities as pgAmenitie}
        <div class="p-2 flex items-center gap-2">
            <img src="/icons/{pgAmenitie}.svg" alt="pg amenity icon"/>
            <p class="text-sm font-normal leading-normal truncate">{pgAmenitiesLabels[pgAmenitie]}</p>
        </div>
    {/each}
</div>

<h2 class="mt-5 mb-5 font-Manrope">owner details</h2>

<div class="mt-3">
    <p class="text-base font-medium leading-normal line-clamp-1">name</p>
    <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">{data.pgProperty.ownerName}</p>
</div>

<div class="mt-3">
    <p class="text-base font-medium leading-normal line-clamp-1">number</p>
    <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">{data.pgProperty.ownerNumber}</p>
</div>

{#if data.pgProperty.ownerEmail}
    <div class="mt-3">
        <p class="text-base font-medium leading-normal line-clamp-1">email</p>
        <p class="text-pg-sky-text text-sm font-normal leading-normal line-clamp-2">{data.pgProperty.ownerEmail}</p>
    </div>
{/if}

{#if data.userLoggedIn}
    <form method="POST" use:enhance={handlePropertyActions}>
        {#if data.isCurrentUserOwner}
            <button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-1 cursor-pointer"
                onclick={() => {
                    sessionStorage.setItem('propertyData', JSON.stringify(data.pgProperty));
                    goto("/pgForm")
                }}
            >
                edit property
                <img src="/icons/edit.svg" alt="edit Icon" />
            </button>
        {:else}
            <button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-1 cursor-pointer"
                onclick={() => {
                    sessionStorage.setItem('propertyDataForBookingRoom', JSON.stringify(data.pgProperty));
                    goto(`/bookPropertyRoom/${data.pgProperty.id}`)
                }}>
                book room
                <img src="/icons/bookRoom.svg" alt="bookRoom Icon" />
            </button>
        {/if}
    </form>
{:else}
    <button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md w-full flex items-center justify-center gap-1 cursor-pointer"
        onclick={() => {
            warning('please login to book a room');
            goto(`/auth/login`)
        }}>
        book room
        <img src="/icons/bookRoom.svg" alt="bookRoom Icon" />
    </button>
{/if}

    
<style>
    :global(#map > div:first-child + div) {
        display: none !important;
    }

    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    .no-scrollbar {
        scrollbar-width: none;
    }
</style>
