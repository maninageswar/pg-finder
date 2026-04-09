<script>
    import SvelteModal from "$lib/components/SvelteModal.svelte";
    import { enhance } from '$app/forms';
    import { success, failure } from "$lib/notification";
    import { goto } from "$app/navigation";
    import { camelToSpaced } from "$lib/utils/sharedlogic";

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
    let openMenuId = $state(null);

    function toggleMenu(bookingId) {
        openMenuId = openMenuId === bookingId ? null : bookingId;
    }

    function handleClickOutside(event) {
        if (!event.target.closest('.ellipsis-menu')) {
            openMenuId = null;
        }
    }

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

    function handleCheckIn() {
        if (allBookings.some(booking => booking.stayStatus === 'checkedIn')) {
            failure('you are already checked in at another property. please check out from there before checking in to a new property');
            return;
        }
        return async ({ result }) => {
            console.log("check in result", result);
            if (result.data.checkInSuccessfully) {
                success(result.data.checkInSuccessfully);
                goto('/userInventory');
            }
            if (result.data.checkInError) {
                failure(result.data.checkInError);
            }
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

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
                <div class="flex items-start gap-2">
                    <div class="px-3 py-0.5 rounded-2xl  {
                        booking.bookingStatus.toLowerCase() === 'booked' ? 'bg-[#ddffef] text-[#059669]' :
                        booking.bookingStatus.toLowerCase() === 'pending' ? 'bg-[#ffebd3] text-[#d97706]' :
                        splitCancelledStatus(booking.bookingStatus).toLowerCase() === 'cancelled' ? 'bg-[#ffe4e6] text-[#b91c1c]' : ''}">
                            {splitCancelledStatus(booking.bookingStatus).toLowerCase()}
                    </div>
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="relative ellipsis-menu">
                        <button onclick={() => toggleMenu(booking.id)}
                            class="p-1 rounded-full hover:bg-slate-100 cursor-pointer transition-colors" aria-label="ellipsis menu">
                            <svg class="w-5 h-5 text-pg-sky-text" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="5" r="2"/>
                                <circle cx="12" cy="12" r="2"/>
                                <circle cx="12" cy="19" r="2"/>
                            </svg>
                        </button>
                        {#if openMenuId === booking.id}
                            <div class="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden font-Manrope">
                                <button onclick={() => { 
                                    openMenuId = null;
                                    goto(`/pgProperty/${booking.expand.propertyId.id}`);
                                    }}
                                    class="w-full text-left px-3 py-2.5 text-sm text-pg-sky hover:bg-slate-50 cursor-pointer flex items-center gap-2 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                        <g fill="none" stroke="#0ea5e9e6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                            <path d="M2.55 13.406c-.272-.373-.408-.56-.502-.92a2.5 2.5 0 0 1 0-.971c.094-.361.23-.548.502-.92C4.039 8.55 7.303 5 12 5s7.961 3.55 9.45 5.594c.272.373.408.56.502.92a2.5 2.5 0 0 1 0 .971c-.094.361-.23.548-.502.92C19.961 15.45 16.697 19 12 19s-7.961-3.55-9.45-5.594"/>
                                            <path d="M12 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/>
                                        </g>
                                    </svg>
                                    view pg
                                </button>
                                <hr class="border-gray-100">
                                <hr class="border-gray-100">
                                <button onclick={() => { openMenuId = null; showModal = true; cancelBookingId = booking.id; }}
                                    disabled={booking.stayStatus === "checkedOut" || splitCancelledStatus(booking.bookingStatus).toLowerCase() === 'cancelled'}
                                    class="w-full text-left px-3 py-2.5 text-sm text-[#b91c1c] hover:bg-red-50 cursor-pointer flex items-center gap-2 transition-colors disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                    cancel booking
                                </button>
                            </div>
                        {/if}
                    </div>
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
                    <p class="font-medium">studio room</p>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div class="flex gap-1 items-center">
                    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="28" height="28"><path d="M28 56h7v7h-7zm14 0h7v7h-7zm15 0h7v7h-7zm15 0h7v7h-7zM28 70h7v7h-7zm14 0h7v7h-7z" fill="#0ea5e9" class="svgShape color000000-0 selectable"/><path d="M92 64.14V34a6 6 0 0 0-6-6h-6v-3.17A4.83 4.83 0 0 0 75.17 20h-5.34A4.83 4.83 0 0 0 65 24.83V28H42v-3.17A4.83 4.83 0 0 0 37.17 20h-5.34A4.83 4.83 0 0 0 27 24.83V28h-5a6 6 0 0 0-6 6v52a6 6 0 0 0 6 6h45.68A22.5 22.5 0 1 0 92 64.14M70 30.5V25h5v7h-5Zm-38 0V25h5v7h-5ZM21 34a1 1 0 0 1 1-1h5.11a.2.2 0 0 1 0 .08 3 3 0 0 0 .09.31 4 4 0 0 0 .17.55c0 .11.1.22.15.33l.25.47.23.26.33.41.26.26.41.33.29.21a4 4 0 0 0 .48.26l.31.15a6 6 0 0 0 .58.18l.28.08a5 5 0 0 0 .93.09h5.34a5 5 0 0 0 .93-.09l.28-.08a6 6 0 0 0 .58-.18l.31-.15a4 4 0 0 0 .48-.26L40 36l.41-.33.26-.26L41 35l.21-.29.25-.47c0-.11.11-.22.15-.33a4 4 0 0 0 .17-.55 3 3 0 0 0 .09-.31.2.2 0 0 1 0-.08h23.2a.2.2 0 0 1 0 .08 3 3 0 0 0 .09.31 4 4 0 0 0 .17.55c0 .11.1.22.15.33l.25.47.27.29.33.41.26.26.41.33.29.21a4 4 0 0 0 .48.26l.31.15a6 6 0 0 0 .58.18l.28.08a5 5 0 0 0 .93.09h5.34a5 5 0 0 0 .93-.09l.28-.08a6 6 0 0 0 .58-.18l.31-.15a4 4 0 0 0 .48-.26L78 36l.41-.33.26-.26L79 35l.21-.29.25-.47c0-.11.11-.22.15-.33a4 4 0 0 0 .17-.55 3 3 0 0 0 .09-.31.2.2 0 0 1 0-.08H86a1 1 0 0 1 1 1v7H21Zm50.5 39c-.38.5-.73 1-1.06 1.55a1 1 0 0 0-.1.16c-.32.51-.61 1-.89 1.57l-.12.24q-.39.79-.72 1.62l-.11.27c-.21.56-.4 1.12-.57 1.7a3 3 0 0 0-.08.27c-.17.59-.31 1.18-.43 1.78a2 2 0 0 0 0 .25 19 19 0 0 0-.27 1.88 1 1 0 0 0 0 .16c-.06.67-.1 1.35-.1 2v.5H22a1 1 0 0 1-1-1V46h66v18.14c-.69.08-1.37.19-2 .32h-.07c-.63.13-1.25.3-1.87.48h-.12c-.6.19-1.18.4-1.76.63l-.21.09c-.56.23-1.1.48-1.63.76l-.25.12c-.52.28-1 .57-1.52.89l-.24.15q-.75.48-1.44 1l-.21.16c-.47.37-.93.75-1.36 1.16l-.16.15c-.45.42-.88.85-1.29 1.31l-.07.08c-.42.47-.83 1-1.2 1.46Zm18 30.48a17.6 17.6 0 0 1-17.31-14.83c0-.37-.08-.72-.11-1.08C72 87 72 86.51 72 86a17.5 17.5 0 1 1 17.5 17.5Z" fill="#0ea5e9" class="svgShape color000000-1 selectable"/><path d="M98.68 84H86.54l3.85-3.85a2.2 2.2 0 0 0 .61-2.1 2.54 2.54 0 0 0-4.27-1.32L78.46 85a2.14 2.14 0 0 0 0 3l8.27 8.27a2.5 2.5 0 0 0 1.77.73 2.57 2.57 0 0 0 2.5-2 2.18 2.18 0 0 0-.61-2.12L86.54 89h12a2.54 2.54 0 0 0 2.09-4 2.2 2.2 0 0 0-1.95-1" fill="#0ea5e9" class="svgShape color000000-2 selectable"/></svg></svg>
                    <p class="text-pg-sky-text">{new Date(booking.checkInDate).toLocaleDateString('en-GB')}</p>
                </div>
                {#if booking.bookingStatus === 'booked' && booking.stayStatus === "yetToBeCheckedIn"}
                    <form method="POST" use:enhance={handleCheckIn}>
                        <button class="px-3 py-0.5 rounded-md text-pg-sky bg-sky100 border border-pg-sky cursor-pointer"
                            formaction={`?/checkIn&bookingId=${booking.id}`}>
                            check in
                        </button>
                    </form>
                {:else if splitCancelledStatus(booking.bookingStatus).toLowerCase() !== 'cancelled'}
                     <p class="text-pg-sky-text italic">({camelToSpaced(booking.stayStatus)})</p>
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