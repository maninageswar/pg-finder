<script>
    let { showToolTip = false, info, toltipClass } = $props();
</script>

<button class="relative group cursor-pointer text-base infoIcon" onclick={()=> {showToolTip = !showToolTip}} type="button"><span class="font-bold text-pg-sky text-lg infoIcon">&#9432;</span>
    <span class="absolute mt-1 {toltipClass}
                group-hover:block {showToolTip ? 'block' : 'hidden'}
                whitespace-normal break-words
                rounded p-1 bg-white
                text-xs leading-relaxed
                text-pg-sky border border-pg-sky shadow-lg z-10">
        {info}
    </span>
</button>