<script>
  import { PG_SKY_COLOR } from '../utils/sharedlogic.js';

  let { width = 24, height = 24, color = PG_SKY_COLOR } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={width}
  height={height}
  viewBox="0 0 24 24"
  ><path
    fill="none"
    stroke={color}
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="m7 7l10 10M7 17L17 7"
  /></svg
>
