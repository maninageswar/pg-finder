<script>
  import { goto } from "$app/navigation";

  let { data } = $props();

  console.log("data main", data.pgInventories);

</script>

<h1>home page</h1>
<button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md float-right" onclick={() => {
      sessionStorage.setItem('propertyData', null);
      goto("/pgForm")
    }}
  >
    create inventory
</button>
<br>

{#each data.pgInventories.items as pgInventory}
  <button class="mt-5 bg-pg-sky text-white" onclick={() => goto(`/pgProperty/${pgInventory.id}`)}>{pgInventory.pgName}</button><br>
{/each}
