<script>
    import PocketBase from "pocketbase";
    import MultiSelect from 'svelte-multiselect'
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { Checkbox, Label, useId } from "bits-ui";
	import Check from "phosphor-svelte/lib/Check";
	import Minus from "phosphor-svelte/lib/Minus";
    import Select from 'svelte-select';
    import { onMount, tick } from 'svelte';
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { redirect } from '@sveltejs/kit';
    import { goto } from "$app/navigation";
    import { success, failure } from '$lib/notification';
    import { preventKeyPress } from '$lib/utils/sharedlogic';
    
    let { data } = $props();

    const pgType = ['gents', 'ladies', 'co-live'];

    const states = [
        "andhra pradesh",
        "arunachal pradesh",
        "assam",
        "bihar",
        "chhattisgarh",
        "goa",
        "gujarat",
        "haryana",
        "himachal pradesh",
        "jharkhand",
        "karnataka",
        "kerala",
        "madhya pradesh",
        "maharashtra",
        "manipur",
        "meghalaya",
        "mizoram",
        "nagaland",
        "odisha",
        "punjab",
        "rajasthan",
        "sikkim",
        "tamil nadu",
        "telangana",
        "tripura",
        "uttar pradesh",
        "uttarakhand",
        "west bengal",
        "andaman and nicobar islands",
        "chandigarh",
        "dadra and nagar haveli and daman and diu",
        "delhi",
        "jammu and kashmir",
        "ladakh",
        "lakshadweep",
        "puducherry"
    ];
    
    const roomTypes = ['sharing 1', 'sharing 2', 'sharing 3', 'sharing 4', 'sharing 5'];

    let noOfFloors = $state();
    let noOfRoomsInEachFloor = $state();
    let depositeAmount = $state(0);
    let refundableDepositeAmount = $state(0);
    let selectedRoomTypes = $state([]);
    let roomNumbers = $state([]);
    let imageFiles = $state([]);
    let pgAmenitiesValues = $state([]);
    let formElement;
    let sharingTypesWithHigherDailyRent = $state([]);

    // getting page state data from pgProperty view page

    let propertyData = JSON.parse(sessionStorage.getItem('propertyData'));

    console.log('pgFormPageData in pgForm page', propertyData);

    selectedRoomTypes = propertyData?.pgRoomTypes || [];
    noOfFloors = propertyData?.pgNoOfFloors || "";
    noOfRoomsInEachFloor = propertyData?.pgNoOfRoomsInEachFloor || "";
    depositeAmount = propertyData?.pgDepositAmount || 0;
    refundableDepositeAmount = propertyData?.pgRefundableDeposit || 0;
    pgAmenitiesValues = propertyData?.pgAmenities || [];

    let updateButtonDisabled = $state(true);

    const pgFormPageDataToCompare = { ...propertyData };
    delete pgFormPageDataToCompare.collectionId;
    delete pgFormPageDataToCompare.collectionName;
    delete pgFormPageDataToCompare.created;
    delete pgFormPageDataToCompare.id;
    delete pgFormPageDataToCompare.updated;

    onMount(async () => {
		if (propertyData) {
            const assignedRooms = propertyData.sharing1Rooms?.concat(
                                  propertyData.sharing2Rooms || [],
                                  propertyData.sharing3Rooms || [],
                                  propertyData.sharing4Rooms || [],
                                  propertyData.sharing5Rooms || [] ) || [];
            calculateRoomNumbers()
            if (assignedRooms.length > 0) {
                roomNumbers = roomNumbers.filter(room => !assignedRooms.includes(room));
            }

            if (propertyData.pgImages.length > 0) {
                await fetchImages(propertyData.pgImages)
            }
        }
	});

    $effect(() => {
        pgAmenitiesValues
        if (propertyData) {
            checkFormDataInEditModeIsEqualToViewPageData()
        }
    });

    async function fetchImages(pgImages) {
        for (const fileName of pgImages) {
            const url = `${PUBLIC_POCKETBASE_REST_API}/files/${propertyData.collectionId}/${propertyData.id}/${fileName}`;
            const res = await fetch(url);
            const blob = await res.blob();
            const file = new File([blob], fileName.replace(/_[^_]+(?=\.[^.]+$)/, ''), { type: blob.type });
            imageFiles.push(file);
        }
    }

    let calculateRoomNumbers = () => {
        roomNumbers = [];
        if (!noOfFloors || !noOfRoomsInEachFloor) return;
        for (let floor = 0; floor <= noOfFloors; floor++) {
            for (let room = 1; room <= noOfRoomsInEachFloor; room++) {
                const roomNum = `${floor}${room.toString().padStart(2, '0')}`;
                if (!roomNumbers.includes(roomNum)) {
                    roomNumbers.push(roomNum);
                }
            }
        }
        roomNumbers.sort((a, b) => Number(a) - Number(b));
    };

    function removeAddedValuesFromRoomNumbers(event) {
        const index = roomNumbers.indexOf(event.option);
        if (index !== -1) {
            roomNumbers.splice(index, 1);
        }
    }

    function addRemovedValuetoRoomNumbers(event) {
        roomNumbers.push(event.option);
        roomNumbers.sort((a, b) => a - b);
    }

    function handleFiles(event) {
        const files = Array.from(event.target.files).filter(f => f.type.startsWith('image/'));
        imageFiles.push(...files.filter(f => !imageFiles.includes(f)));
        if (propertyData) {
            checkIfImagesChangedInEditMode()
        }
    }

    function removeFile(index) {
        imageFiles.splice(index, 1);
        if (propertyData) {
            checkIfImagesChangedInEditMode()
        }
    }

    function checkIfImagesChangedInEditMode() {
        if (propertyData?.pgImages.length != imageFiles.length) {
            updateButtonDisabled = false
        } else {
            for (const file of imageFiles) {
                let formattedPgImageNames = propertyData?.pgImages.map(imgName => imgName.replace(/_[^_]+(?=\.[^.]+$)/, ''));
                if (!formattedPgImageNames.includes(file.name)) {
                    updateButtonDisabled = false
                    return
                }
            }
        }
    }

    function checkFormDataInEditModeIsEqualToViewPageData() {
        if (propertyData) {
            tick().then(() => {
                const formDataObjInEdit = Object.fromEntries(new FormData(formElement).entries());
                formDataObjInEdit.pgAmenities = Object.values(pgAmenitiesValues);

                for (const key in formDataObjInEdit) {
                    if (key == 'pgImages') continue;

                    if (key == 'pgAmenities' || ['pgRoomTypes','sharing1Rooms', 'sharing2Rooms', 'sharing3Rooms', 'sharing4Rooms', 'sharing5Rooms'].includes(key)) {
                        if (arraysEqualUnordered(pgFormPageDataToCompare[key], key == 'pgAmenities' ? formDataObjInEdit[key]: JSON.parse(formDataObjInEdit[key]) )) {
                            updateButtonDisabled = true;
                            continue
                        } else {
                            updateButtonDisabled = false;
                            break
                        }
                    }

                    if (key == 'pgState' || key == 'pgType') {
                        if (pgFormPageDataToCompare[key] == JSON.parse(formDataObjInEdit[key]).value) {
                            updateButtonDisabled = true;
                            continue
                        } else {
                            updateButtonDisabled = false;
                            break
                        }
                    }

                    if (key == 'pgAddress') {
                        if (pgFormPageDataToCompare[key].replace(/\r\n/g, '\n') == formDataObjInEdit[key].replace(/\r\n/g, '\n')) {
                            updateButtonDisabled = true;
                            continue
                        } else {
                            updateButtonDisabled = false;
                            break
                        }
                    }
                    
                    if (pgFormPageDataToCompare[key] == formDataObjInEdit[key]) {
                        updateButtonDisabled = true;
                        continue
                    } else {
        updateButtonDisabled = false;
                        break
                    }
                }
          })  
        }
    }

    function arraysEqualUnordered(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return sorted1.every((val, i) => val === sorted2[i]);
    }

    const handleSubmit = ({ formData }) => {
    formData.delete("pgImages");
    console.log('formData in handle submit',formData.get("ownerEmail"))
    for(let i=0; i < imageFiles.length; i++) {
        formData.append('pgImages',imageFiles[i])
    }
    return async ({ result }) => {
        console.log('result',result)
        if (result.type === 'success') {
            if (result.data?.propertyCreated) {
                success(result.data?.propertyCreated)
                goto('/')  
            }
            if (result.data?.propertyUpdated) {
                success(result.data?.propertyUpdated);
                goto(`/pgProperty/${propertyData.id}`)
            }
        }
        if (result.type === 'failure') {
            handleErrors(result.data?.errors || result.data);
        }
    };
  };

    function handleErrors(errors) {
        console.error('Form submission error:', errors);
        for (const key of Object.keys(errors)) {
            if (key === 'pgImages') {
                failure(`${key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}: Failed to upload ${errors[key].params.file} - the maximum allowed file size is 5mb`)
            } else {
                failure(`${key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}: ${errors[key].message}`)
            }
        }
    }

    function checkDailyRentGreaterThanMonthlyRent() {
        const formData = new FormData(formElement);
        for (let i = 1; i <= selectedRoomTypes.length; i++) {
            const monthlyRent = Number(formData.get(`sharing${i}Rent`));
            const dailyRent = Number(formData.get(`sharing${i}PerDayRent`));
            if ((monthlyRent > 0 && dailyRent > 0) && dailyRent >= monthlyRent) {
                if (!sharingTypesWithHigherDailyRent.includes(`sharing${i}PerDayRent`)) {
                    sharingTypesWithHigherDailyRent.push(`sharing${i}PerDayRent`);
                }
            } else {
                sharingTypesWithHigherDailyRent = sharingTypesWithHigherDailyRent.filter(
                    item => item !== `sharing${i}PerDayRent`
                );
            }
        }
    }

</script>

<!-- snippets -->
{#snippet Input({required=false, name='', type="text", label="", bindValue='',placeholder='',readonly=false})}
    <label for={name}>{label}</label><span class="text-red-500 {!required ? 'hidden' : ''}">*</span>
    <input {type} id={name} {name} {placeholder} value={bindValue} {required}
        onwheel={(e) => e.target.blur()}
        onkeydown={(e) => { if (type == 'number') preventKeyPress(e, ['e', ' ', '+', '-', '.'])}}
        {readonly}
        class="w-full mt-1 mb-4 border border-pg-sky rounded-md {readonly ? "bg-pg-sky-input-disabled cursor-not-allowed" : ""}"/>
{/snippet}

{#snippet MyCheckbox({ value, label })}
    {@const id = useId()}
    <div class="flex items-center">
        <Checkbox.Root
            {id}
            aria-labelledby="{id}-label"
            class="border-pg-sky data-[state=unchecked]:border-pg-sky data-[state=checked]:border-pg-sky data-[state=unchecked]:bg-backgrounddata-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
            {value}
        >
            {#snippet children({ checked, indeterminate })}
                <div class="text-pg-sky inline-flex items-center justify-center">
                    {#if indeterminate}
                        <Minus class="size-[15px]" weight="bold" />
                    {:else if checked}
                        <Check class="size-[15px]" weight="bold" />
                    {/if}
                </div>
            {/snippet}
        </Checkbox.Root>
        <Label.Root
            id="{id}-label"
            for={id}
            class="pl-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            {label}
        </Label.Root>
    </div>
{/snippet}


<form class="flex-row justify-center" method="POST" action="?/createInventory" use:enhance={handleSubmit} bind:this={formElement} enctype="multipart/form-data" oninput={checkFormDataInEditModeIsEqualToViewPageData}>

    <!-- owner details -->

    <h3 class="mb-2">owner details</h3>

    {@render Input({required:true, name:"ownerName", type:"text", label:"name", bindValue:propertyData?.ownerName, placeholder:"enter owner's name"})}

    {@render Input({required:true, name:"ownerNumber", type:"number", label:"mobile", bindValue:propertyData?.ownerNumber, placeholder:"enter owner's mobile no."})}

    {@render Input({required:true, name:"ownerEmail", type:"email", label:"email", bindValue:(propertyData?.ownerEmail || data.user?.email), readonly:true})}

    <!-- pg details -->

    <h3 class="mt-5 mb-2">pg details</h3>

    {@render Input({required:true, name:"pgName", type:"text", label:"name", bindValue:propertyData?.pgName})}

    <label for="pgAddress">address</label><span class="text-red-500">*</span>
    <textarea id="pgAddress" name="pgAddress" rows="3" cols="40" value={propertyData?.pgAddress} required class="w-full mt-1 mb-4 border border-pg-sky rounded-md focus:border-pg-sky" placeholder="enter address"></textarea>

    {@render Input({required:true, name:"pgCity", type:"text", label:"city/district/town", bindValue:propertyData?.pgCity})}

    {@render Input({required:false, name:"pgLandmark", type:"text", label:"landmark", bindValue:propertyData?.pgLandmark})}

    <label for="pgState">state</label><span class="text-red-500">*</span>
    <div class="mt-1 mb-4">
        <Select items={states} required={true} name="pgState" placeholder='please select' value={propertyData?.pgState} on:change={checkFormDataInEditModeIsEqualToViewPageData}/>
    </div>

    {@render Input({required:true, name:"pgPincode", type:"number", label:"pincode", bindValue:propertyData?.pgPincode})}
    
    {@render Input({required:true, name:"pgLocation", type:"url", label:"location", bindValue:propertyData?.pgLocation, placeholder:"please provide the location link"})}

    <div class="flex gap-4 mt-1 {refundableDepositeAmount > depositeAmount ? "mb-2" : "mb-4"}">
        <div>
            <label for="pgDepositAmount">deposite amount</label><span class="text-red-500">*</span>
            <input type="number" id="pgDepositAmount" name="pgDepositAmount" bind:value={depositeAmount} required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full border border-pg-sky rounded-md focus:border-pg-sky"/>
        </div>
        
        <div>
            <label for="pgRefundableDeposit">refundable deposite</label><span class="text-red-500">*</span>
            <input type="number" id="pgRefundableDeposit" name="pgRefundableDeposit" bind:value={refundableDepositeAmount} required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full border {refundableDepositeAmount > depositeAmount ? "border-pg-red" : "border-pg-sky"} rounded-md"/>
                <!-- TO CHECK: check when we add "border-pg-red" still some pg-sky border is visible this is because of ring on focus
                 that is appllied accross the appllication check how to prevent it  -->
        </div>
    </div>
    <div class="text-pg-red text-sm {refundableDepositeAmount > depositeAmount  ? "mb-4" : "hidden"}">refundable amount cannot be greater than deposite</div>

    <label for="pgType">pg type</label><span class="text-red-500">*</span>
    <div class="mt-1 mb-4">
        <Select items={pgType} required={true} name="pgType" placeholder='please select' value={propertyData?.pgType} on:change={checkFormDataInEditModeIsEqualToViewPageData}/>
    </div>
    
    <label for="pgType">pg room types</label><span class="text-red-500">*</span>
    <div class="mt-1 mb-4">
        <MultiSelect closeDropdownOnSelect={false} bind:selected={selectedRoomTypes} name="pgRoomTypes" options={roomTypes} onchange = {checkFormDataInEditModeIsEqualToViewPageData} required={true}/>
    </div>


    <!-- pg room types rents -->

     {#each selectedRoomTypes as selectedRoomType }
        <div class="flex gap-3 justify-around items-baseline">
            <div class="basis-1/3"><label for={selectedRoomType.replace(" ", "-")}>{selectedRoomType}</label><span class="text-red-500">*</span></div><span>:</span>
            <input type="number" id={selectedRoomType} name="{`${selectedRoomType.replace(" ", "")}Rent`}" 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onblur={checkDailyRentGreaterThanMonthlyRent}
                onwheel={(e) => e.target.blur()}
                value={propertyData ? propertyData[`${selectedRoomType.replace(" ", "")}Rent`] : "" } 
                class="w-2/4 mt-1 mb-4 border border-pg-sky rounded-md focus:border-pg-sky"
                placeholder="monthly rent"
                required/>
            <input type="number" name="{`${selectedRoomType.replace(" ", "")}PerDayRent`}"
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onblur={checkDailyRentGreaterThanMonthlyRent}
                onwheel={(e) => e.target.blur()}
                value={propertyData ? propertyData[`${selectedRoomType.replace(" ", "")}PerDayRent`] : "" } 
                class="w-2/4 mt-1 mb-4 border rounded-md
                {sharingTypesWithHigherDailyRent.includes(`${selectedRoomType.replace(" ", "")}PerDayRent`) ? "border-pg-red focus:border-pg-red" : "border-pg-sky focus:border-pg-sky"}"
                placeholder="perday rent"
                required/>
        </div>
     {/each}

    <div class="text-pg-red text-sm {sharingTypesWithHigherDailyRent.length > 0 ? "mb-3" : "hidden"}">per day rent cannot be greater than or equal to monthly rent</div>

    <div class="flex gap-4">
        <div>
            <label for="pgNoOfFloors">no. of floors</label><span class="text-red-500">*</span>
            <input type="number" id="pgNoOfFloors" name="pgNoOfFloors" bind:value={noOfFloors} required oninput={calculateRoomNumbers} 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full mt-1 mb-4 border border-pg-sky rounded-md focus:border-pg-sky"/>
        </div>
        
        <div>
            <label for="pgNoOfRoomsInEachFloor">no. of rooms in each floor</label><span class="text-red-500">*</span>
            <input type="number" id="pgNoOfRoomsInEachFloor" name="pgNoOfRoomsInEachFloor" bind:value={noOfRoomsInEachFloor} required oninput={calculateRoomNumbers}
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full mt-1 mb-4 border border-pg-sky rounded-md focus:border-pg-sky"/>
        </div>
    </div>

    {#if noOfFloors && noOfRoomsInEachFloor && selectedRoomTypes.length > 0}
        <label class="inline-block mb-4">assign rooms no. to respective types</label><span class="text-red-500">*</span>
        {#each selectedRoomTypes as selectedRoomType }
            <div class="mb-4">
                <label class="inline-block mb-1">{selectedRoomType}</label>
                <MultiSelect
                selected={propertyData ? propertyData[`${selectedRoomType.replace(" ", "")}Rooms`] : []}
                closeDropdownOnSelect = {false}
                onchange = {checkFormDataInEditModeIsEqualToViewPageData}
                onadd = {removeAddedValuesFromRoomNumbers} 
                onremove = {addRemovedValuetoRoomNumbers}
                onremoveAll = {addRemovedValuetoRoomNumbers}
                name={`${selectedRoomType.replace(" ", "")}Rooms`} 
                options={roomNumbers}
                required={true}
                />
            </div>
        {/each}
    {/if}

    
    <!-- pg aminities -->

    <Checkbox.Group
        class="flex flex-col gap-3 mt-4"
        name="pgAmenities"
        bind:value={pgAmenitiesValues}
    >
        <label for=pgAmenities>pg amenities</label>
        <div class="grid grid-flow-col grid-rows-10 gap-4">
            {@render MyCheckbox({ label: "study table & chair", value: "studyTableChair" })}
            {@render MyCheckbox({ label: "cupboard/wardrobe", value: "cupboardWardrobe" })}
            {@render MyCheckbox({ label: "geyser/hot water", value: "geyserHotWater" })}

            {@render MyCheckbox({ label: "refrigerator", value: "refrigerator" })}
            {@render MyCheckbox({ label: "3 meals a day", value: "threeMeals" })}

            {@render MyCheckbox({ label: "room cleaning", value: "roomCleaning" })}
            {@render MyCheckbox({ label: "washing machines", value: "washingMachines" })}

            {@render MyCheckbox({ label: "high speed wi-fi", value: "wifi" })}
            {@render MyCheckbox({ label: "common tv", value: "commonTv" })}

            {@render MyCheckbox({ label: "cctv surveillance", value: "cctvSurveillance" })}
            {@render MyCheckbox({ label: "biometric entry", value: "biometricEntry" })}

            {@render MyCheckbox({ label: "parking space", value: "parkingSpace" })}

            {@render MyCheckbox({ label: "air conditioning", value: "airConditioning" })}
            {@render MyCheckbox({ label: "gym/fitness area", value: "gymFitnessArea" })}
            {@render MyCheckbox({ label: "indoor games", value: "indoorGames" })}

            {@render MyCheckbox({ label: "lift/elevator", value: "liftAvaliability" })}
            {@render MyCheckbox({ label: "power backup", value: "powerBackup" })}
            {@render MyCheckbox({ label: "common kitchen", value: "commonKitchen" })}
            {@render MyCheckbox({ label: "ro water", value: "roWater" })}

        </div>
    </Checkbox.Group>

    <!-- pg images -->
    <br>
    <label>pg images</label>
    {#if imageFiles.length>0}
        <ul class="file-list">
            {#each imageFiles as file, i}
                <li class="border border-pg-sky rounded-md">
                {file.name}
                <button onclick={() => removeFile(i)} type="button" class="delete-btn text-pg-sky px-4 py-2 rounded-md">
                    <img src="/icons/close.svg" alt="close Icon" />
                </button>
                </li>
            {/each}
        </ul>
    {/if}

    <div class="flex items-center justify-end">
        <label class="upload-btn bg-pg-sky rounded-md text-white px-4 py-2">upload images
            <input type="file" accept="image/*" name="pgImages" multiple onchange={handleFiles} hidden/>
        </label>
    </div>    
    
    {#if propertyData}
    <!-- // TO LEARN:(learn how form submit works) check how to use redirect and also see why redirect is working if we use formaction in update button  but redirect is not working if we use fetch that is called from handleUpdateSubmit in +page.svelte of this folder -->
        <!-- <button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-sky-300" formaction="?/updateInventory&recordId={propertyData.id}">update property</button> -->
        <button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md w-full cursor-pointer disabled:cursor-not-allowed disabled:bg-pg-sky-button-disabled"
            disabled={updateButtonDisabled}
            formaction={`/pgForm?/updateInventory&recordId=${propertyData.id}`}>
            update property
        </button>
    {:else}
        <!-- used class composition and applied pg-sky-button -->
        <button class="w-full pg-sky-button mt-5" type="submit">create property</button>
    {/if}
</form>

<style>
    :global(div.multiselect) {
        border-color: var(--color-pg-sky) !important;
        border-radius: 0.375rem;
        min-height: 41px !important;
    }

    .file-list {
        list-style: none;
        padding: 0;
        margin-top: 0.2rem;
    }

    .file-list li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f2f2f2;
        padding-left: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 6px;
    }

    .delete-btn {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
    }

    :global(.svelte-select) {
        border: 1px solid var(--color-pg-sky) !important;
    }

    :global(.svelte-select button) {
        color: var(--color-pg-sky) !important;
    }

    :global(.svelte-select-list .item.active) {
        background: var(--color-pg-sky) !important;
        color: white;
    }

    :global(.svelte-select-list .hover) {
        background: none !important;
    }

    :global([aria-selected="true"]) {
        background: var(--color-pg-sky) !important;
        color: white !important;
    }

    :global(.multiselect .remove-all) {
        color: var(--color-pg-sky) !important;
        font-size: 1.2rem;
    }

    :global(.multiselect .remove):hover {
        background: none !important;
    }

    :global(div.multiselect input):focus {
        --tw-ring-color: none !important;
    }
</style>