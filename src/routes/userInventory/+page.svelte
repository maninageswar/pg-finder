<script>
    import { goto } from "$app/navigation";

</script>

<h2 class="font-Manrope mb-5">manage inventory</h2>

{#if true}
    <div class="w-full px-2">
        <div class="flex items-center justify-center">
            <img src="/icons/addInventory.svg" class="rotate-10" alt="add inventory" height="250px" width="250px">
        </div>
        <p class="text-pg-sky-text mb-4">want to make your inventory visible in this application? wanna showcase your pg details, share important information, and help users discover what you offer then
            <button onclick={()=>{
                sessionStorage.setItem('propertyData', null);
                goto("/pgForm")}
            } class="bg-pg-sky text-white rounded-md cursor-pointer px-3">&#x2B; create inventory</button>
        </p>

        <p class="text-pg-sky-text">
            looking for a new pg? you got to the right place. explore the wide range of pg options, compare locations, check amenities, and discover what suits your lifestyle
            <button onclick={()=>{goto("/")}} class="bg-pg-sky text-white rounded-md cursor-pointer px-3">here.</button>
        </p>
        <div class="w-full flex items-center justify-center -translate-y-10">
            <img src="/icons/findHome.svg" alt="find home" height="360px" width="360px">
        </div>
    </div>
{/if}