<script>
    import { enhance } from '$app/forms';
    import { success, failure, warning } from '$lib/notification';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto, invalidate } from '$app/navigation';
    import Google from '$lib/svg/Google.svelte';
    import Eye from '$lib/svg/Eye.svelte';
    import EyeOff from '$lib/svg/EyeOff.svelte';


    let { data } = $props();

    let showPassword = $state(false);
    
    function togglePassword() {
        showPassword = !showPassword;
    }

    onMount(() => {
        if (data?.accountCreated) {
            success('your account has been created successfully please login to continue');
        }
        if($page.url.searchParams.get('authRequired')) {
            warning('your are not logged in please login');
        }
    })

    async function handleLogin() {
        return async ({ result }) => {
            if (result.type === 'success') {
                // await goto('/');
                // await invalidate('app:user');
                // if you need you understand why only the below order of gotto and invlidate works and not the above one follow this link https://chatgpt.com/c/69a97ad7-c268-8323-a2b2-d495c5996188
                // imaportant learning: you should always use "invalidate" first then "goto" if you ever use them together
                await invalidate('app:home');
                await goto('/');
                success('logged in successfully');
            } else if (result.type === 'failure') {
                failure('invalid email or password. please check');
            }
        }
    }

</script>

<div class="flex flex-col justify-center items-center mb-5">
    <img src="/images/hostelRegister.jpeg" alt="">
    <h2 class="font-Manrope text-center font-bold text-[28px]">home is just a click away let's get you there</h2>
</div>

<form action="?/login" method="POST" use:enhance={handleLogin}>
    <label for="email">email<span class="text-red-500">*</span></label>
    <input class="w-full mt-1 mb-4 border border-pg-sky rounded-md" name="email" id="email" type="email" required placeholder="enter your email">

    <label for="password">password<span class="text-red-500">*</span></label>
    <div class="relative">
        <input 
            class="w-full mt-1 mb-4 border border-pg-sky rounded-md pr-10" 
            name="password"
            id="password"
            type={showPassword ? "text" : "password"} 
            placeholder="enter your password"
            required
        >
        <button 
            type="button"
            class="absolute right-3 top-1/4" 
            onclick={()=>togglePassword()}
        >
            {#if !showPassword}
                <EyeOff/>
            {:else}
                <Eye/>
            {/if}
        </button>
    </div>

    <button class="pg-sky-button w-full mt-4">login</button>


    <div class="flex items-center gap-4 py-8">
        <hr class="flex-1 border-t border-pg-sky-button-disabled"/>
        <p class="text-pg-sky-button-disabled">or</p>
        <hr class="flex-1 border-t border-pg-sky-button-disabled"/>
    </div>
</form>

<form action="/auth/signUp?/continueWithGoogle" method="POST" use:enhance>
    <button class="border border-pg-sky px-4 py-2 text-pg-sky rounded-md w-full flex justify-center items-center">
        <Google/>
        <p class="ml-3 text-transparent bg-clip-text bg-[linear-gradient(to_right,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)] cursor-pointer">
            continue with google
        </p>
    </button>
</form>

<p class="pt-8 text-center text-sm font-normal leading-normal text-slate-500">
    don't have an account?
    <a class="font-bold text-pg-sky underline" href="/auth/signUp">sign up</a>
</p>
