import { Cashfree, CFEnvironment } from "cashfree-pg";
import { PUBLIC_CASHFREE_APP_ID, PUBLIC_CASHFREE_SECRET_KEY } from "$env/static/public";

// TO DO (important): change environment to PRODUCTION and also change the app id and secret key to actual creds before going live
const cashfree = new Cashfree(CFEnvironment.SANDBOX, PUBLIC_CASHFREE_APP_ID, PUBLIC_CASHFREE_SECRET_KEY);

export const POST = async ({ url, request }) => {
    console.log('createCashFreePaymentOrder action called');
    const requestBody = await request.json();
    console.log('request body:', requestBody);
    var cashFreeOrderRequest = {
        "order_amount": requestBody.totalAmount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": requestBody.userId,
            "customer_phone": requestBody.userMobileNumber,
        },
        "order_meta": {
            "return_url": `${url.origin}/userInventory?order_id={order_id}`
        }
    };

    try {
        let response = await cashfree.PGCreateOrder(cashFreeOrderRequest);
        
        return new Response(JSON.stringify({ paymentSessionId: response.data.payment_session_id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
        
     } catch (error) {
        console.error("Error while creating CashFree payment order:", error);
        return new Response(JSON.stringify({ createCashFreePaymentOrderError: error.response.data.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
     }
}

export async function GET({ url }) {
	const orderId = url.searchParams.get("order_id");

	const response = await cashfree.PGFetchOrder(orderId);

	return new Response(JSON.stringify(response.data));
}