 <script>
    import SvelteModal from "$lib/components/SvelteModal.svelte";
    import { goto } from "$app/navigation";

    let { propertyName, roomNumber, stayType, roomType, refundableDeposit, checkInDate, checkOutDate, propertyId, bookingStatus } = $props();
    let showModal = $state(false);
</script>

 <div class="bg-pg-sky text-white rounded-2xl p-5 shadow-lg relative font-Manrope overflow-hidden">

    <div class="absolute size-35 rounded-full bg-white/10 -top-10 -right-10"></div>

    <div class="flex justify-between items-center mb-4">
        <p class="text-[25px] tracking-widest text-white/70 truncate">{propertyName}</p>
        <span class="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full text-green-600 text-xs font-semibold z-2">
          <!-- TO IMPLEMENT : think of introducing property type(pg, studio room, flat) in future-->
          <span class="bg-green-500 h-2 w-2 rounded-full"></span> pg
        </span>
    </div>

    <h2 class="text-4xl font-bold leading-tight mb-4">room {roomNumber.toString().length == 1 ? `00${roomNumber}` : roomNumber}</h2>

    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p class="text-lg font-semibold text-white mt-0.5">{stayType}</p>
            <p class="text-sm font-semibold text-white/80 mt-0.5">{roomType}</p>
      </div>

      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
        <p class="{checkOutDate ? 'text-[12px]' : 'text-[15px]'} tracking-wider text-white/60 mb-1 font-bold">check-in date</p>
        <p class="{checkOutDate ? 'text-sm' : 'text-lg'} font-semibold mb-2">{new Date(checkInDate).toLocaleDateString('en-GB')}</p>
        
        {#if checkOutDate}
          <p class="text-[12px]  tracking-wider text-white/60 mb-1 font-bold">check-out date</p>
          <p class="text-sm font-semibold">{new Date(checkOutDate).toLocaleDateString('en-GB')}</p>
        {/if}
        
      </div>
    </div>

    <div class="flex gap-3">
      <button type="button" class="basis-1/2 bg-white/15 text-white font-semibold py-2.5 rounded-xl border border-white/30 hover:bg-white/25 transition-colors text-lg"
        onclick={() => goto(`/pgProperty/${propertyId}`)}>view pg</button>
      <button type="button" class="basis-1/2 bg-white text-pg-sky font-semibold py-2.5 rounded-xl shadow-md hover:shadow-lg transition-shadow text-lg"
        onclick={() => showModal = true}>check out</button>
    </div>

    <SvelteModal bind:showModal
        title="check out property?" 
        description="are you sure you want to check out of this property? if you do plese collect the refundable deposit from the owner."
        formaction="?/checkOutInventory"
        buttonTitle="check out"
    />

  </div>