<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { load } from "@cashfreepayments/cashfree-js";

    let { data } = $props();
    let selectedPaymentMethod = $state("");
    let cashfree;
    var initializeSDK = async function () {          
        cashfree = await load({
            mode: "sandbox"
        });
    }
    initializeSDK();

    const doPayment = async (sessionId) => {
        let checkoutOptions = {
            paymentSessionId: sessionId,
        };
        cashfree.checkout(checkoutOptions);
    };

    async function handlePayment() {   
        const response = await fetch('/api/cashFree', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify($page.state.paymentInfo)
        });
        const result = await response.json();
        console.log('result from action', result);
        // currently payment gateway is not working 
        // if (result.paymentSessionId) {
        //     doPayment(result.paymentSessionId);
        // } else {
        //     console.error('Payment session ID not received');
        // }
    }
</script>

<h2 class="font-Manrope mb-5">select payment method</h2>

<p class="mb-2 font-Manrope text-lg font-medium">payment with out gateway charges</p>

<label class="border border-gray-200 rounded-xl w-full h-35 p-4 flex flex-col justify-between font-Manrope mb-5 cursor-pointer">
    <div>
        <input class="mr-2 accent-pg-sky border-pg-sky h-4" type="radio" name="paymentMethod" onchange={() => { selectedPaymentMethod = 'paidOffline'; }} value="paidOffline"/>
        paid cash offline
    </div>
    <hr class="flex-1 border-t border-pg-sky-button-disabled mt-1"/>
    <p class="text-pg-sky-text">
        select this option if you have paid the amount in cash to the property owner. make sure the payment is done before opting this option
    </p>
</label>

<label class="border border-gray-200 rounded-xl w-full h-35 p-4 flex flex-col justify-between font-Manrope mb-5 cursor-pointer">
    <div>
        <input class="mr-2 accent-pg-sky border-pg-sky h-4" type="radio" name="paymentMethod" onchange={() => { selectedPaymentMethod = 'paidThroughUPI'; }} value="paidThroughUPI"/>
        paid through upi manually
    </div>
    <hr class="flex-1 border-t border-pg-sky-button-disabled mt-1"/>
    <p class="text-pg-sky-text">
        select this option if you have paid the amount through upi to the property owner's upi id or upi number.
    </p>
</label>

<button class="pg-sky-button w-full mb-10" disabled={!(selectedPaymentMethod === 'paidOffline' || selectedPaymentMethod === 'paidThroughUPI')}>confirm payment</button>

<p class="mb-2 font-Manrope text-lg font-medium">payment with gateway charges</p>

<label class="border border-gray-200 rounded-xl w-full h-35 p-4 flex flex-col justify-between font-Manrope mb-5 cursor-pointer">
    <div>
        <input class="mr-2 accent-pg-sky border-pg-sky h-4" type="radio" name="paymentMethod" id="paidOfflineGateway" onchange={() => { selectedPaymentMethod = 'paymentGateway'; }} value="paymentGateway"/>
        pay using payment gateway (cashfree)
    </div>
    <hr class="flex-1 border-t border-pg-sky-button-disabled mt-1"/>
    <p class="text-pg-sky-text">
        select this option if you want use payment gateway which charges you some amount as processing fee which is non refundable.
    </p>
</label>

<button class="pg-sky-button w-full mb-10" onclick={handlePayment} disabled={!(selectedPaymentMethod === 'paymentGateway')}>proceed to pay {$page.state.paymentInfo.totalAmount}</button>


<style>
    :global([type='radio']:checked) {
        background-color: var(--color-pg-sky) !important;
    }
</style>