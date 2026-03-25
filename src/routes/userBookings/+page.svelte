<script>
    import { isFutureDate } from "$lib/utils/sharedlogic";
    import SvelteModal from "$lib/components/SvelteModal.svelte";
    import { enhance } from '$app/forms';
    import { success, failure } from "$lib/notification";
    import { invalidate } from "$app/navigation";

    let { data } = $props();
    let allBookings = $state(data.userBookings);
    let activeFilter = $state('all');
    // if you wanna know why i used derived state check out the file at src/lib/learnings/learningsInUserBookingsPage.txt (read this important)
    let userBookings = $derived(
        activeFilter === 'all'
            ? allBookings
            : allBookings.filter(booking => splitCancelledStatus(booking.bookingStatus).toLowerCase() === activeFilter)
    );
    let all = $state(true);
    let booked = $state(false);
    let pending = $state(false);
    let cancelled = $state(false);
    let showModal = $state(false);
    let cancelBookingId = $state(null);

    function filterBookings(event) {
        const filter = event.target.innerText.toLowerCase();
        all = filter === 'all';
        booked = filter === 'booked';
        pending = filter === 'pending';
        cancelled = filter === 'cancelled';
        activeFilter = filter;
    }

    function splitCancelledStatus(str) {
        return str.split(/(?=[A-Z])/)[0];
    }

    async function handleCancelBooking() {
        return async ({ result }) => {
            console.log("cancel booking result", result);
            if (result.data.cancelledSuccessfully) {
                const updatedBooking = result.data.updatedBooking;
                allBookings = allBookings.map(booking =>
                    booking.id === updatedBooking.id ? { ...booking, bookingStatus: updatedBooking.bookingStatus } : booking
                );
                // here ideally i should use invalidate to re-fetch the data after cancelling a booking but to optimize
                // if you wanna know how i have avoided using invalidate check out the file at src/lib/learnings/learningsInUserBookingsPage.txt 
                // invalidate('app:userBookings');
                success(result.data.cancelledSuccessfully);
            }
            if (result.data.cancelError) {
                failure(result.data.cancelError);
            }
        }
    }
</script>

<h2 class="font-Manrope mb-5">user bookings</h2>

<div class="flex gap-2 py-1 justify-between mb-4 *:border *:px-5 *:py-2 *:rounded-3xl *:cursor-pointer">
    <button onclick={filterBookings} class="{all ? 'bg-pg-sky text-white' : 'border-gray-200 '}">all</button>
    <button onclick={filterBookings} class="{booked ? 'bg-pg-sky text-white' : 'border-gray-200 '}">booked</button>
    <button onclick={filterBookings} class="{pending ? 'bg-pg-sky text-white' : 'border-gray-200 '}">pending</button>
    <button onclick={filterBookings} class="{cancelled ? 'bg-pg-sky text-white' : 'border-gray-200 '}">cancelled</button>
</div>

{#if data.loadError}
<!-- yet to design error state -->
    <p class="text-red-500">{data.loadError}</p>
{:else if data.userBookings.length === 0}
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)]">
        <img src="/icons/noFavorites.svg" class="w-[400px] h-[300px]" alt="noFavorites">
        <p class="font-Manrope text-pg-sky-text text-center">you don't have any bookings made yet. please start exploring and make a booking <a class="font-bold text-pg-sky underline" href="/">here.</a></p>
    </div>
{:else}
    {#each userBookings as booking}
        <div class="border border-gray-200 p-4 rounded-xl mb-4">
            <div class="flex items-center justify-between gap-2 mb-3">
                <div class="min-w-0">
                    <h3 class="font-semibold font-Manrope mb-1 truncate">{booking.propertyName}</h3>
                    <a href={booking.expand.propertyId.pgLocation} class="flex items-center gap-1 cursor-pointer">
                        <img src="/icons/location.svg" alt="locationIcon">
                        <div class="min-w-0 flex justify-between">
                            <p class="text-sm text-pg-sky-text font-Manrope truncate lowercase">{booking.expand.propertyId.pgAddress}, {booking.expand.propertyId.pgCity}, {booking.expand.propertyId.pgState}</p>
                            <div class="text-pg-sky-text inline-flex items-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M7 7h10v10" />
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="px-3 py-0.5 rounded-2xl {
                    booking.bookingStatus.toLowerCase() === 'booked' ? 'bg-[#ddffef] text-[#059669]' :
                    booking.bookingStatus.toLowerCase() === 'pending' ? 'bg-[#ffebd3] text-[#d97706]' :
                    splitCancelledStatus(booking.bookingStatus).toLowerCase() === 'cancelled' ? 'bg-[#ffe4e6] text-[#b91c1c]' : ''}">
                        {splitCancelledStatus(booking.bookingStatus).toLowerCase()}
                </div>
            </div>
            
            <div class="bg-slate-100 p-4 rounded-lg flex items-center justify-between mb-3">
                <div class="text-center">
                    <h4 class="text-[#64748b] mb-2">stay type</h4>
                    <p class="font-medium">{booking.stayType}</p>
                </div>

                <div class="text-center">
                    <h4 class="text-[#64748b] mb-2">room details</h4>
                    <p class="font-medium">{booking.roomNumber.toString().length == 1 ? `00${booking.roomNumber}` : booking.roomNumber}, {booking.roomType}</p>
                </div>

                <div class="text-center">
                    <h4 class="text-[#64748b] mb-2">type</h4>
                    <p class="font-medium">pg</p>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex gap-1 items-center">
                    <img src="/icons/calender.svg" alt="calender icon" width="30" height="30">
                    <p class="text-pg-sky-text flex gap-1">{new Date(booking.checkInDate).toLocaleDateString('en-GB')}<span class="text-sm italic">( check-in )</span></p>
                </div>
                {#if isFutureDate(booking.checkInDate) && splitCancelledStatus(booking.bookingStatus).toLowerCase() !== 'cancelled'}
                    <button onclick={() => {showModal = true
                        cancelBookingId = booking.id;
                    }} class="px-3 py-0.5 rounded-md text-pg-sky bg-sky100 border border-pg-sky cursor-pointer">cancel</button>
                {/if}
            </div>
            
        </div>
    {/each}
    <form method="POST" use:enhance={handleCancelBooking}>
        <SvelteModal bind:showModal
            title="cancel the booking?" 
            description="are you sure you want to cancel this booking? if you do, please collect the amount you paid for this booking from the owner offline."
            formaction={`?/cancelBooking&bookingId=${cancelBookingId}`}
            buttonTitle="yes"
        />
    </form>
{/if}