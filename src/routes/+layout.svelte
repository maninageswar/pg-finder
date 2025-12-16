<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { page } from '$app/state';
	
	let { children } = $props();
	let focus = $state()
</script>

<SvelteToast options={{ reversed: false, intro: { y: -200 } }}/>

<div class="px-4 pt-4 overflow-x-hidden">
	{@render children()}
</div>

<br>
<br>
<br>

{#if page.url.pathname !== "/auth/login" && page.url.pathname !== "/auth/signUp"}
	<footer class="max-w-[450px] fixed bottom-0 w-full bg-white flex py-3 justify-around align-items-center shadow-[0_-4px_6px_rgba(0,0,0,0.1)]">
		<a href="/" ><img src={`/icons/home${page.url.pathname === '/' ? 'Filled' : 'Line'}.svg`} alt="home icon"/></a>
		<a href="/favorites"><img src={`/icons/favorite${page.url.pathname === '/favorites' ? 'Filled' : 'Line'}.svg`} alt="favorite icon"/></a>
		<a href="/userInventory"><img src={`/icons/building${page.url.pathname === '/userInventory' ? 'Filled' : 'Line'}.svg`} alt="building icon"/></a>
		<a href="/userProfile"><img src={`/icons/userProfile${page.url.pathname === '/userProfile' ? 'Filled' : 'Line'}.svg`} alt="profile icon"/></a>
	</footer>
{/if}

<style>
  :root {
    --toastContainerLeft: calc(50vw - 12rem);
	--toastWidth: 24rem;
	--toastBorderRadius: 0.375rem;
	--toastBackground: #ffffffff;
  }
</style>