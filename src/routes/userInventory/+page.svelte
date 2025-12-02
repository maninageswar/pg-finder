<script>
    import { goto } from "$app/navigation";

</script>

<h2 class="font-Manrope mb-5">manage inventory</h2>

{#if true}
    <div class="h-[85vh]">
        <div class="w-full min-h-[50%] mb-4 p-2">
            <div class="flex justify-start">
                <img src="/icons/addInventory.svg" alt="add inventory" height="250px" width="250px">
            </div>
            <p class="text-pg-sky-text">want to make your inventory visible in this application? wanna showcase your pg details, share important information, and help users discover what you offer then
                <button onclick={()=>{goto("/pgForm")}} class="bg-pg-sky text-white rounded-md cursor-pointer px-3">&#x2B; create inventory</button>
            </p>
        </div>

        <div class="w-full  min-h-[50%] p-2">
            <p class="text-pg-sky-text">
                looking for a new pg? you got to the right place. explore the wide range of pg options, compare locations, check amenities, and discover what suits your lifestyle
                <button onclick={()=>{goto("/")}} class="bg-pg-sky text-white rounded-md cursor-pointer px-3">here.</button>
            </p>
            <div class="flex justify-end">
                <img src="/icons/findHome.svg" alt="find home" height="300px" width="300px">
            </div>
        </div>
    </div>
{/if}