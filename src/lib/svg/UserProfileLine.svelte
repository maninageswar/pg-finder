<script>
  import { PG_SKY_COLOR } from '../utils/sharedlogic.js';

  let { width = 24, height = 24, color = PG_SKY_COLOR } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 24 24"
  ><g fill="none"
    ><path d="M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0" /><path
      stroke={color}
      stroke-linecap="square"
      stroke-width="2"
      d="M19.5 20v-1a4 4 0 0 0-4-4h-7a4 4 0 0 0-4 4v1M16 7a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"
    /></g
  ></svg
>
