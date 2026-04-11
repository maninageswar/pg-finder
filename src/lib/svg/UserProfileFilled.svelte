<script>
  import { PG_SKY_COLOR } from '../utils/sharedlogic.js';

  let { width = 24, height = 24, color = PG_SKY_COLOR } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 24 24"
  ><path
    fill={color}
    d="M7 7a5 5 0 1 1 10 0A5 5 0 0 1 7 7M3.5 19a5 5 0 0 1 5-5h7a5 5 0 0 1 5 5v2h-17z"
  /></svg
>
