<script>
  import { goto } from "$app/navigation";
  import { warning } from "$lib/notification";

  let { data } = $props();


</script>

<h1>home page</h1>
<!-- TO DO: check if user is logged in only then redirect to pgForm page-->
<button class="mt-5 bg-pg-sky text-white px-4 py-2 rounded-md float-right" onclick={() => {
      // sessionStorage.setItem('propertyData', null);
      if (data.user) {
        goto("/pgForm")
      } else {
        warning('please login to create inventory');
        goto('/auth/login')
      }
    }}
  >
    create inventory
</button>
<br>

{#each data.pgInventories?.items as pgInventory}
  <button class="mt-5 bg-pg-sky text-white" onclick={() => goto(`/pgProperty/${pgInventory.id}`)}>{pgInventory.pgName}</button><br>
{/each}
