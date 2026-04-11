<script>
	import '../app.css';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import { page } from '$app/state';
	import FavoriteFilled from '$lib/svg/FavoriteFilled.svelte';
	import FavoriteLine from '$lib/svg/FavoriteLine.svelte';
	import HomeFilled from '$lib/svg/HomeFilled.svelte';
	import HomeLine from '$lib/svg/HomeLine.svelte';
	import UserProfileFilled from '$lib/svg/UserProfileFilled.svelte';
	import UserProfileLine from '$lib/svg/UserProfileLine.svelte';
	import BuildingFilled from '$lib/svg/BuildingFilled.svelte';
	import BuildingLine from '$lib/svg/BuildingLine.svelte';
	
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
		<a href="/" >
			{#if page.url.pathname === '/'}
				<HomeFilled/>
			{:else}
				<HomeLine/>
			{/if}
		</a>
		<a href="/favorites">
			{#if page.url.pathname === '/favorites'}
				<FavoriteFilled/>
			{:else}
				<FavoriteLine/>
			{/if}
		</a>
		<a href="/userInventory">
			{#if page.url.pathname === '/userInventory'}
				<BuildingFilled/>
			{:else}
				<BuildingLine/>
			{/if}
		</a>
		<a href="/userProfile">
			{#if page.url.pathname === '/userProfile'}
				<UserProfileFilled/>
			{:else}
				<UserProfileLine/>
			{/if}
		</a>
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