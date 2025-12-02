<script>
    import { PUBLIC_POCKETBASE_REST_API } from '$env/static/public';
    import { tick } from 'svelte';
    import { enhance } from '$app/forms';
    import { success, failure } from '$lib/notification';
    import { preventKeyPress } from '$lib/utils/sharedlogic';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let editingProfile = $state(false);
    let userName;
    let formErrors = $state({});
    let isUpdateProfileButtonDisabled = $state(true);
    let formElement;

    let formHasErrors = $derived.by(() => {
        if (editingProfile) {
            return Object.keys(formErrors).length > 0;
        }
        return false;
    });

    function handleSubmit() {
        return async ({ result }) => {
            console.log('form submit result', result);
            if (result.type === 'success') {
                if (result.data?.userProfile) {
                    data = result.data
                    success('your profile updated successfully');
                }
                if (result.data?.logout) {
                    success('logged out successfully');
                    goto('/auth/login');
                }
            } else if (result.type === 'failure') {
                if (result.data?.errors?.logoutError) { failure(result.data?.logoutError) }
                else if (result.data?.errors?.mobileNumber) { 
                    failure(result.data?.errors?.mobileNumber)
                    editingProfile = true
                }
                else if (result.data?.errors?.emergencyContactNumber) {
                    failure(result.data?.errors?.emergencyContactNumber)
                    editingProfile = true
                }
                else {
                    failure(result.data?.errors?.message || 'failed to update user profile')
                    editingProfile = true
                };
            } else {
                failure('something went wrong while updating user profile');
            }
            isUpdateProfileButtonDisabled = true
        }
    }

    function validateMobileNumber(event) {
        const input = event.target;
        const mobileNumber = input.value;
        const mobileNumberPattern = /^[0-9]{10}$/;

        if (!mobileNumberPattern.test(mobileNumber)) {
            formErrors[input.name] = 'enter a valid 10 digit mobile number';
        } else {
            delete formErrors[input.name];
        }
    }

    function validateEmail(event) {
        const input = event.target;
        const email = input.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            formErrors[input.name] = 'enter a valid email address';
        } else {
            delete formErrors[input.name];
        }
    }

    function isProfileEdited() {
        const formDataObjInEdit = Object.fromEntries(new FormData(formElement).entries());
        isUpdateProfileButtonDisabled = Object.keys(formDataObjInEdit).every((key) => {
            if (key == "mobileNumber" && formDataObjInEdit["mobileNumber"] == "") {
                return true;
            }
            if (key == "emergencyContactNumber" && formDataObjInEdit["emergencyContactNumber"] == "") {
                return true;
            }
              return formDataObjInEdit[key] == String(data.userProfile[key]) 
            }
        );
    }
</script>

<div class="flex items-center justify-between mb-5">
    <h2 class="font-Manrope">user profile</h2>
    <form method="POST" use:enhance={handleSubmit}>
        <button class="cursor-pointer bg-pg-sky rounded-md p-1 pl-2"
            formaction="?/logout">
            <img src="/icons/logout.svg" alt="logout icon"/>
        </button>
    </form>
</div>

<form method="POST" action="?/updateUserProfile" use:enhance={handleSubmit} bind:this={formElement} enctype="multipart/form-data" oninput={isProfileEdited}>

    <div class="flex flex-col items-center p-5">
        <img src={ data.userProfile.avatar ? `${PUBLIC_POCKETBASE_REST_API}/files/${data.userProfile.collectionId}/${data.userProfile.id}/${data.userProfile.avatar}` : "/images/pgProfile.png"}
            alt="" class="border border-pg-sky rounded-full shadow-xl w-[150px] h-[150px] mb-4"/>
    </div>

    <div class="border-3 border-pg-sky-light {editingProfile ? "has-[:focus]:border-pg-sky" : "shadow-md"} rounded-full h-16 mb-6 flex items-center px-6 relative">
        <label for="name" class="absolute bottom-12 text-xl">name<span class="text-red-500 {!editingProfile ? 'hidden' : ''}">*</span></label>
        <input class="w-full font-Manrope text-pg-sky-text text-lg border-none focus:ring-0 p-0"
            readonly={!editingProfile} name="name" bind:this={userName} value={data.userProfile.name} type="text">
    </div>

    <div class="border-3 border-pg-sky-light
        {editingProfile ? (formErrors?.email ? "has-[:focus]:border-pg-red-button" : "has-[:focus]:border-pg-sky") : "shadow-xl"}
        rounded-full h-16 {formErrors?.email ? "mb-1" : "mb-6"} flex items-center px-6 relative">
        <label for="email" class="absolute bottom-12 text-xl">email<span class="text-red-500 {!editingProfile ? 'hidden' : ''}">*</span></label>
        <input class="w-full font-Manrope text-pg-sky-text text-lg border-none focus:ring-0 p-0"
            readonly={!editingProfile} name="email" value={data.userProfile.email} type="email"
            oninput={validateEmail}>
    </div>
    <span class="text-pg-red text-sm {formErrors?.email ? "mb-8" : "hidden"} px-6">{formErrors?.email}</span>
    
    <div class="border-3 border-pg-sky-light {formErrors?.email ? "mt-4" : ""}
        {editingProfile ? (formErrors?.mobileNumber ? "has-[:focus]:border-pg-red-button" : "has-[:focus]:border-pg-sky") : "shadow-xl"}
        rounded-full h-16 {formErrors?.mobileNumber ? "mb-1" : "mb-6"} flex items-center px-6 relative">
        <label for="mobileNumber" class="absolute bottom-12 text-xl">mobile no.<span class="text-red-500 {!editingProfile ? 'hidden' : ''}">*</span></label>
        <input class="w-full font-Manrope text-pg-sky-text text-lg border-none focus:ring-0 p-0" 
            readonly={!editingProfile} name="mobileNumber" value={data.userProfile.mobileNumber || ""} placeholder='please update your mobile number' type="number"
            oninput={validateMobileNumber}
            onwheel={(e) => e.target.blur()}
            onkeydown={(e) => { preventKeyPress(e, ['e', ' ', '+', '-', '.'])}}>
    </div>
    <span class="text-pg-red text-sm {formErrors?.mobileNumber ? "mb-8" : "hidden"} px-6">{formErrors?.mobileNumber}</span>

    <div class="border-3 border-pg-sky-light {formErrors?.mobileNumber ? "mt-4" : ""}
        {editingProfile ? (formErrors?.emergencyContactNumber ? "has-[:focus]:border-pg-red-button" : "has-[:focus]:border-pg-sky") : "shadow-xl"}
        rounded-full h-16 {formErrors?.emergencyContactNumber ? "mb-1" : "mb-6"} flex items-center px-6 relative">
        <label for="emergencyContactNumber" class="absolute bottom-12 text-xl">{data.isCurrentUserOwner ? "alternate no.": "emergency contact no."}<span class="text-red-500 {!editingProfile ? 'hidden' : ''}">*</span></label>
        <input class="w-full font-Manrope text-pg-sky-text text-lg border-none focus:ring-0 p-0"
            readonly={!editingProfile} name="emergencyContactNumber" value={data.userProfile.emergencyContactNumber || null} placeholder={data.isCurrentUserOwner ? 'please update alternate contact number' : 'please update emergency contact number'} type="number"
            oninput={validateMobileNumber}
            onwheel={(e) => e.target.blur()}
            onkeydown={(e) => { preventKeyPress(e, ['e', ' ', '+', '-', '.'])}}>
    </div>
    <span class="text-pg-red text-sm {formErrors?.emergencyContactNumber ? "mb-6" : "hidden"} px-6">{formErrors?.emergencyContactNumber}</span>
    
    <button class="mt-5 pg-sky-button w-full flex items-center justify-center gap-1 cursor-pointer"
        type={!editingProfile ? "notbutton" : "button"}
        disabled={editingProfile && isUpdateProfileButtonDisabled || formHasErrors}
        onclick={() => {
            editingProfile = !editingProfile
            tick().then(() => {userName?.focus()});
            }}>
        <div>{editingProfile ? "update" : "edit"} profile</div> 
        <img src="/icons/edit.svg" class="{editingProfile ? "hidden" : ""}" alt="edit Icon"/>
    </button>
</form>

<style>
    label {
        background: #FFFFFF;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1) 100%);
    }

    input::placeholder {
        color: #A0AEC0;
        opacity: 1;
        font-size: medium;
    }
</style>