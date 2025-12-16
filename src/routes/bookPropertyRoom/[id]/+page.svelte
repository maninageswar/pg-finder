<script>
    import ProductSummaryCard from "$lib/components/cards/ProductSummaryCard.svelte";
    import { Label, Switch } from "bits-ui";

    let propertyDataForBookingRoom = JSON.parse(sessionStorage.getItem('propertyDataForBookingRoom'));
   
</script>

<h2 class="font-Manrope mb-5">book room</h2>

<div class="mb-2">property</div>
<a class="mb-3 block" href="{`/pgProperty/${propertyDataForBookingRoom.id}`}">
    <ProductSummaryCard property = {propertyDataForBookingRoom} />
</a>

<form method="POST">
    <label for="name">name</label><span class="text-red-500">*</span>
    <input type="text" name="name" required 
        onwheel={(e) => e.target.blur()}
        class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>

    <label for="email">email</label><span class="text-red-500">*</span>
    <input type="email" name="email" required 
        onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
        onwheel={(e) => e.target.blur()}
        class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>

    <div class="flex gap-2">
        <div>
            <label for="mobileNumber">mobile number</label><span class="text-red-500">*</span>
            <input type="number" name="userName" required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>
        </div>
        <div>
            <label for="emergencyContactNumber">emergency contact</label><span class="text-red-500">*</span>
            <input type="number" name="emergencyContactNumber" required 
                onkeydown={(e) => preventKeyPress(e, ['e', ' ', '+', '-', '.'])}
                onwheel={(e) => e.target.blur()}
                class="w-full border border-pg-sky rounded-md focus:border-pg-sky mb-4"/>
        </div>

    </div>



    <!-- <div class="flex items-center justify-between mb-4">
    <div><label for="emergencyContactNumber">daily stay</label><span class="text-red-500">*</span><span class="italic text-pg-sky-text text-sm">( enable for staying few days )</span></div>
    <Switch.Root
        id="dnd"
        name="hello"
        class="focus-visible:ring-foreground focus-visible:ring-offset-background data-[state=checked]:bg-pg-sky-light data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:shadow-mini-inset dark:data-[state=checked]:bg-foreground focus-visible:outline-hidden peer inline-flex h-[36px] min-h-[36px] w-[60px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
        <Switch.Thumb
        class="bg-background data-[state=unchecked]:shadow-mini dark:border-background/30 dark:bg-foreground dark:shadow-popover pointer-events-none block size-[30px] shrink-0 rounded-full transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 dark:border dark:data-[state=unchecked]:border bg-white"
        />
    </Switch.Root>
    </div> -->

    <label for="stayType">select stay type</label><span class="text-red-500">*</span>
    <div class="flex justify-between mt-2 mb-4">
        <div class="w-[50%] justify-start pl-3"><input class="mr-2 accent-pg-sky border-pg-sky" type="radio" name="stayType" value="dailyStay" required />few days stay</div>
        <div class="w-[50%] justify-start pl-3"><input class="mr-2 accent-pg-sky border-pg-sky" type="radio" name="stayType" value="monthlyStay" required />monthly stay</div>
    </div>

</form>
