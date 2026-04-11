<script>
    import AddInventory from "$lib/svg/AddInventory.svelte";
    import FindHome from "$lib/svg/FindHome.svelte";
</script>

<div class="w-full px-2">
    <div class="flex items-center justify-center">
         <div class="rotate-10 h-[250px] w-[250px]">
            <AddInventory/>
         </div>
    </div>
    <p class="text-pg-sky-text mb-4 text-justify">want to make your inventory visible in this application? then
        <button onclick={()=>{
                sessionStorage.setItem('propertyData', null);
                if (data.user) {
                    goto("/pgForm")
                } else {
                    warning('please login to create inventory');
                    goto('/auth/login')
                }
            } 
        } class="text-pg-sky underline cursor-pointer">create an inventory.</button> looking to manage your inventory? you can find all your inventories listed here once they are verified.
    </p>

    <p class="text-pg-sky-text relative z-20 text-justify">
        searching for a new pg? then explore them
        <a href="/" class="text-pg-sky underline cursor-pointer">here.</a> looking for your booked inventory? it will be visible here once check-in date matches the current date. you can find all your bookings in <a href="/userBookings" class="text-pg-sky underline cursor-pointer">my bookings</a> from user profile page.
        <!-- if you have booked a room in a property the property details will be visible this page once the booking is approved and the current date is equal to or after the check-in date.  -->
    </p>
    <div class="w-full flex items-center justify-center -translate-y-10">
        <div class="size-[360px]">
            <FindHome/>
        </div>
    </div>
</div>