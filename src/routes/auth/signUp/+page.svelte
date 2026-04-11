<script>
    import { enhance } from '$app/forms';
    import { success, failure } from '$lib/notification';
    import { page } from '$app/stores';
    import Google from '$lib/svg/Google.svelte';
    import Eye from '$lib/svg/Eye.svelte';
    import EyeOff from '$lib/svg/EyeOff.svelte';

    let { form } = $props();

    let showPassword = $state(false);
    
    function togglePassword() {
        showPassword = !showPassword;
    }

    $effect(()=>{
        if (form?.error && form?.errorResponse?.data) {
            handleErrors(form?.errorResponse?.data?.errors || form?.errorResponse?.data);
            // here in the above line i have used logical or || because i have observed that
            // pocketbase is throwing multiple errors in errors under data prop if there is 
            // single error it is throwing in data prop to handle both cased i used ||
        } 
        if (form?.error) {
            failure(form?.error);
        }
        if ($page.url.searchParams.get('oauthError')) {
            failure('oauth error: unable to continue with google. please try again');
        }
    })

    function handleErrors(errors) {
        console.error('Form submission error:', errors);
        for (const key of Object.keys(errors)) {
            if (key === 'email') {
                failure(`${key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}: your eamail is already registered please login`);
            } else {
                failure(`${key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()}: ${errors[key].message.toLowerCase()}`);
            }
        }
    }

</script>

<div class="flex flex-col justify-center items-center mb-5">
    <img src="/images/hostelRegister.jpeg" alt="">
    <h2 class="font-Manrope text-center font-bold text-[28px]">find your next home that meets your needs</h2>
</div>

<form action="?/register" method="POST" use:enhance>
    <label for="name">name<span class="text-red-500">*</span></label>
    <input class="w-full mt-1 mb-4 border border-pg-sky rounded-md" value={form?.name} name="name" type="text" placeholder="enter your name" required>

    <label for="email">email<span class="text-red-500">*</span></label>
    <input class="w-full mt-1 mb-4 border border-pg-sky rounded-md" value={form?.email} name="email" type="email" placeholder="enter your email" required>

    <label for="password">password<span class="text-red-500">*</span></label>
    <div class="relative">
        <input 
            class="w-full mt-1 mb-4 border border-pg-sky rounded-md pr-10"
            value={form?.password}
            name="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="enter your password"
            required
        >
        <button 
            type="button"
            class="absolute right-3 top-1/4" 
            onclick={()=>togglePassword()}>
            {#if !showPassword}
                <EyeOff/>
            {:else}
                <Eye/>
            {/if}
        </button>
    </div>
    
    <div class="{form?.passwordsDonNotMatch ? "mb-1" : "mb-4"}">
        <label for="confirmPassword">confirm password<span class="text-red-500">*</span></label>
        <input class="w-full mt-1 border {form?.passwordsDonNotMatch ? "border-pg-red" : "border-pg-sky"} rounded-md"
            value={form?.confirmPassword}
            oninput={() => {
                if (form?.passwordsDonNotMatch) form = { ...form, passwordsDonNotMatch: null };
            }}
            name="confirmPassword" type="text" placeholder="confirm your password" required>
        <span class="text-pg-red text-sm {form?.passwordsDonNotMatch ? "" : "hidden"}">{form?.passwordsDonNotMatch}</span>
    </div>

    <button class="pg-sky-button w-full mt-4">sign up</button>

    <div class="flex items-center gap-4 py-8">
        <hr class="flex-1 border-t border-pg-sky-button-disabled"/>
        <p class="text-pg-sky-button-disabled">or</p>
        <hr class="flex-1 border-t border-pg-sky-button-disabled"/>
    </div>
</form>

<form action="?/continueWithGoogle" method="POST" use:enhance>
    <button class="border border-pg-sky px-4 py-2 text-pg-sky rounded-md w-full flex justify-center items-center">
        <Google/>
        <p class="ml-3 text-transparent bg-clip-text bg-[linear-gradient(to_right,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)] cursor-pointer">
            continue with google
        </p>
    </button>
</form>

<p class="pt-8 text-center text-sm font-normal leading-normal text-slate-500">
    already have an account?
    <a class="font-bold text-pg-sky underline" href="/auth/login">login</a>
</p>
