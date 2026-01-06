<script>
	import { DateInput } from 'date-picker-svelte'
  const currentDate = new Date()
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  
  let { minDate = currentDate,
        maxDate = oneYearLater,
        maxWidth = "200px",
        placeholder = "please select date",
        selectedDate = $bindable()
      } = $props();

</script>

<div class="relative" style="max-width: {maxWidth}">
  <img src="/icons/calender.svg" alt="" class="absolute size-7 -z-10 right-0.5 translate-y-1/4"/>
  <DateInput {placeholder}
    bind:value={selectedDate}
    closeOnSelection = true
    min={minDate}
    max={maxDate}
    format = "dd-MM-yyyy"
    dynamicPositioning = true
    />
</div>


	<style>
		:global(body) {
			--date-picker-highlight-border : var(--color-pg-sky);
			--date-picker-foreground : var(--color-pg-sky);
		}

    :global(.date-time-field input) {
      width: 100% !important;
      border: 1px solid var(--color-pg-sky)!important;
      border-radius: 0.375rem !important;
      height: 42px;
      padding-left: 0.8rem !important;
      color: black !important;
      background: transparent !important;
    }

    :global(.date-time-field input:focus) {
      box-shadow: none !important;
      border: 2px solid var(--color-pg-sky) !important;
    }
	</style>