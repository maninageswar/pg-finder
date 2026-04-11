<script>
  import { PG_SKY_COLOR } from '../utils/sharedlogic.js';

  let { width = 24, height = 24, color = PG_SKY_COLOR } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 50 50"
>
  <path
    fill={color}
    d="M25 42c-9.4 0-17-7.6-17-17S15.6 8 25 8s17 7.6 17 17s-7.6 17-17 17m0-32c-8.3 0-15 6.7-15 15s6.7 15 15 15s15-6.7 15-15s-6.7-15-15-15"
    stroke-width="1.5"
    stroke={color}
  />
  <path
    fill={color}
    d="M25.3 34.7L15.6 25l9.7-9.7l1.4 1.4l-8.3 8.3l8.3 8.3z"
    stroke-width="1.5"
    stroke={color}
  />
  <path
    fill={color}
    d="M17 24h17v2H17z"
    stroke-width="1.5"
    stroke={color}
  />
</svg>
