<script>
    import ProductSummaryCard from "$lib/components/cards/ProductSummaryCard.svelte";
    import DatePicker from "$lib/components/DatePicker.svelte";
    import { Label, Switch } from "bits-ui";
    import Select from 'svelte-select';
    import { preventKeyPress, calculateDaysBetween, getRemainingDaysInMonth } from '$lib/utils/sharedlogic';
    import { goto } from "$app/navigation";

    let { data } = $props();
    let propertyDataForBookingRoom = JSON.parse(sessionStorage.getItem('propertyDataForBookingRoom'));
    let stayType = $state('monthlyStay');
    let selectedRoomType = $state(null);
    let selectedRoom = $state(null);
    let avaliabeRoomsOfSelectedRoomType = $state([]);
    let showToolTip = $state(false);
    let pgRent = $state(0);
    let checkInDate = $state(new Date());
    let checkOutDate = $state();
    let isPaymentButtonDisabled = $state(true);
    let formElement;

    console.log('propertyDataForBookingRoom', propertyDataForBookingRoom);

    $effect(() => {
        if (stayType === 'monthlyStay' && checkInDate && selectedRoomType) {
            let rentPerMonth = propertyDataForBookingRoom[`${selectedRoomType?.value.replace(' ', '')}Rent`];
            const lastDayOfMonth = new Date(checkInDate.getFullYear(), checkInDate.getMonth() + 1, 0).getDate();
            pgRent = Math.floor(rentPerMonth * getRemainingDaysInMonth(checkInDate) / lastDayOfMonth);
            selectedRoom ? isPaymentButtonDisabled = false : isPaymentButtonDisabled = true;
        } else if (stayType === 'fewDaysStay' && checkInDate && checkOutDate && selectedRoomType) {
            let rentPerDay = propertyDataForBookingRoom[`${selectedRoomType?.value.replace(' ', '')}PerDayRent`];
            let selectedPeriodDays = calculateDaysBetween(checkInDate, checkOutDate);
            console.log('selectedPeriodDays', selectedPeriodDays);
            pgRent = rentPerDay * selectedPeriodDays;
            selectedRoom ? isPaymentButtonDisabled = false : isPaymentButtonDisabled = true;
        } else {
            pgRent = 0;
        }
    });

    function updateAvailableRooms() {
        if (selectedRoomType) {
            selectedRoom = null;
            avaliabeRoomsOfSelectedRoomType = Object.entries(propertyDataForBookingRoom[`${selectedRoomType?.value.replace(' ', '')}AvailableRooms`])
                .filter(([key, value]) => value > 0)
                .map(([key]) => key);
            avaliabeRoomsOfSelectedRoomType.sort((a,b)=> +a - +b);
        } else {
            avaliabeRoomsOfSelectedRoomType = [];
        }
    }

    function goToPaymentPage() {
        const formData = new FormData(formElement);
        const paymentInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            userMobileNumber: formData.get('userMobileNumber'),
            emergencyContactNumber: formData.get('emergencyContactNumber'),
            userId: data.user.id,
            propertyId: propertyDataForBookingRoom.id,
            stayType,
            checkInDate,
            checkOutDate,
            roomType: selectedRoomType.value,
            roomNumber: selectedRoom.value,
            totalAmount: propertyDataForBookingRoom.pgDepositAmount + pgRent
        }
        goto("/paymentPage", { state: { paymentInfo } });
    }
    
</script>

<h2 class="font-Manrope mb-5">book room</h2>

<div class="mb-2">property</div>
<a class="mb-3 block" href="{`/pgProperty/${propertyDataForBookingRoom.id}`}">
    <ProductSummaryCard property = {propertyDataForBookingRoom} />
</a>

<form bind:this={formElement}>
    <label for="name">name</label><span class="text-red-500">*</span>
    <input type="text" name="name" required 
        onwheel={(e) => e.target.blur()}
        value={data.user.name || null}
        readonly
        class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4 bg-pg-sky-input-disabled cursor-not-allowed"/>

    <label for="email">email</label><span class="text-red-500">*</span>
    <input type="email" name="email" required 
        onwheel={(e) => e.target.blur()}
        value={data.user.email}
        readonly 
        class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4 bg-pg-sky-input-disabled cursor-not-allowed"/>

    <div class="flex gap-2">
        <div>
            <label for="mobileNumber">mobile number</label><span class="text-red-500">*</span>
            <input type="number" name="userMobileNumber" required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                value={data.user.mobileNumber || null}
                class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>
        </div>
        <div>
            <label for="emergencyContactNumber">emergency contact</label><span class="text-red-500">*</span>
            <input type="number" name="emergencyContactNumber" required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                value={data.user.emergencyContactNumber || null}
                class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>
        </div>

    </div>

    <label for="stayType">select stay type</label><span class="text-red-500">*</span>
    <div class="flex justify-between mt-2 mb-4 *:w-[50%] *:justify-start *:pl-3">
        <div><input class="mr-2 accent-pg-sky border-pg-sky" type="radio" name="stayType" checked onchange={() => stayType = 'monthlyStay'} value="monthlyStay"/>monthly stay</div>
        <div><input class="mr-2 accent-pg-sky border-pg-sky" type="radio" name="stayType" onchange={() => stayType = 'fewDaysStay'} value="fewDaysStay"/>few days stay</div>
    </div>

    {#if stayType === 'fewDaysStay'}
    <div class="flex gap-2 justify-between mb-4">
        <div class="w-full">
            <label for="checkInDate">check in date</label><span class="text-red-500">*</span>
            <DatePicker bind:selectedDate={checkInDate} />
        </div>

        <div class="w-full">
            <label for="checkOutDate">check out date</label><span class="text-red-500">*</span>
            <DatePicker bind:selectedDate={checkOutDate} minDate={checkInDate} />
        </div>
    </div>
        
    {/if}

    {#if stayType === 'monthlyStay'}
        <div class="w-[200px] mb-4">
            <label for="checkInDate">check in date</label><span class="text-red-500">*</span>
            <DatePicker bind:selectedDate={checkInDate} />
        </div>
    {/if}

    <div class="flex gap-2 justify-between mb-4">
        <div class="w-full">
            <label for="pgType">select room type</label><span class="text-red-500">*</span>
            <div class="mt-1">
                <Select items={propertyDataForBookingRoom.pgRoomTypes} bind:value={selectedRoomType} on:change={updateAvailableRooms} required={true} name="roomType" placeholder='please select room type'/>
            </div>
        </div>
        <div class="w-full">
            <label for="pgType">select room</label><span class="text-red-500">*</span>
            <div class="mt-1">
                <Select items={avaliabeRoomsOfSelectedRoomType} bind:value={selectedRoom} required={true} name="roomNumber" placeholder='please select room' disabled = {!selectedRoomType ? true : false}/>
            </div>
        </div>
    </div>

    <h2 class="font-Manrope mt-7 mb-5">check in</h2>

    <div class="mb-5 flex justify-between">
        <div class="flex justify-between w-[75%]">
            <p class="text-xl text-pg-sky-text flex items-baseline gap-1">pg rent for {stayType === 'fewDaysStay' ? 'selected days' : 'current month'}
                <!-- tooltip -->
                <button class="relative group cursor-pointer text-base {pgRent ? 'block' : 'hidden'}" onclick={()=> showToolTip = !showToolTip} type="button"><span class="font-bold">&#9432;</span>
                <span class="absolute left-1/2 -translate-x-1/2 top-full mt-2
                            min-w-[20rem] max-w-[25rem]
                            hidden group-hover:block {showToolTip ? 'block' : 'hidden'}
                            whitespace-normal break-words
                            rounded p-1 bg-white
                            text-xs leading-relaxed
                            text-pg-sky border border-pg-sky shadow-lg z-10">
                    {stayType === 'fewDaysStay' ? 'this rent is calculated based on your selected period' : 'this rent is calculated for the remaining days of the current month from the selected check in date'}
                </span>
            </button>
            </p>

            <span>:</span>
        </div>
        <h2 class="font-Manrope text-pg-sky">&#8377;{pgRent}
        </h2>
    </div>

    <div class="mb-5 flex justify-between">
        <div class="flex justify-between w-[75%]">
            <p class="text-xl text-pg-sky-text">deposite amount</p><span>:</span>
        </div>
        
        <h2 class="font-Manrope text-pg-sky">&#8377;{propertyDataForBookingRoom.pgDepositAmount}</h2>
    </div>

    <div class="mb-5 flex justify-between">
        <div class="flex justify-between w-[75%]">
            <p class="text-xl text-pg-sky-text">total amount</p><span>:</span>
        </div>
        <h2 class="font-Manrope text-pg-sky">&#8377;{propertyDataForBookingRoom.pgDepositAmount + pgRent}</h2>
    </div>

    <button type="button" onclick={goToPaymentPage} class="w-full pg-sky-button" disabled={isPaymentButtonDisabled}>make the payment of &#8377;{propertyDataForBookingRoom.pgDepositAmount + pgRent}</button>
</form>

<style>
    :global([type='radio']:checked) {
        background-color: var(--color-pg-sky) !important;
    }

    :global(.svelte-select) {
        border: 1px solid var(--color-pg-sky) !important;
    }

    :global(.svelte-select button) {
        color: var(--color-pg-sky) !important;
    }

    :global(.svelte-select.disabled) {
        background-color: var(--color-pg-sky-input-disabled) !important;
    }

    :global(.svelte-select-list .item.active) {
        background: var(--color-pg-sky) !important;
        color: white;
    }

    :global(.svelte-select-list .hover) {
        background: none !important;
    }
</style>
