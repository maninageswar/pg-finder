<script>
    import { goto } from "$app/navigation";
    import { warning } from "$lib/notification";
    import DefaultUserInventoryPage from "$lib/components/DefaultUserInventoryPage.svelte";
    import UserInventoryCard from "$lib/components/cards/UserInventoryCard.svelte";

    let { data } = $props();

    console.log("userBookedProperty", data.userBookedProperty);

</script>

<h2 class="font-Manrope mb-5">user inventory</h2>


{#if data.user && !data.user.isOwner && false}
    {#each data.userBookedProperty as userBookedProperty}
        {#if userBookedProperty.bookingStatus == "booked" || true}
            <UserInventoryCard {...userBookedProperty} />
        {:else}
            <div id="pendingBookingCard" class="bg-yellow-400 rounded-2xl p-5 shadow-lg relative font-Manrope overflow-hidden">
                <div class="absolute size-35 rounded-full bg-black/10 -top-10 -right-10"></div>
                <h2 class="text-3xl font-bold leading-tight mb-4 text-white">pending booking request</h2>
                <p class="text-lg font-semibold text-black/70 mt-0.5">
                    you have a pending booking request. you can view its details under pending booking info once approved.
                </p>
            </div>
        {/if}
    {/each}
    

<!-- {:else if false} -->
    <!-- show the page for owner -->
{:else}
    <DefaultUserInventoryPage/>
{/if}