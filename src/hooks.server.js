import PocketBase from "pocketbase";
import { PUBLIC_POCKETBASE_SERVER_URL } from "$env/static/public";

export const handle = async ({ event, resolve }) => {
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_SERVER_URL)

    // here we are reading the same jwt token that was set in line 24 as a cookie and loadFromCookie() will decode the jwt token 
    // and set the authStore.model with the user details which will be available in event.locals.pb.authStore.model and we are also
    // setting the user details in event.locals.user to make it easily accessible in the load functions of the routes for server side
    // rendering and also in the +page.svelte files for client side rendering.
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

    try {
        // Refresh the auth model (if valid)
        if (event.locals.pb.authStore.isValid) {
            await event.locals.pb.collection('users').authRefresh();
        }
    } catch (_) {
        // Invalid token, clear it
        event.locals.pb.authStore.clear();
    }

    // Expose the logged-in user for server-side rendering
    event.locals.user = event.locals.pb.authStore.model;
    const response = await resolve(event);
    // The below line is setting jwt token(which has user details) as a cookie "pb_auth" in the response header which will be sent 
    // automatically in the subsequent requests to the server. 

    // And here "sameSite: 'Lax'" is required because
    // When a payment gateway (like Cashfree) redirects the user back to our app after completing a payment, the browser
    // navigates from an external domain (Cashfree's) to our domain. By default, PocketBase's exportToCookie() sets
    // SameSite=Strict, which tells the browser to NOT include cookies when navigating from an external site to ours.
    // This caused the pb_auth cookie to be missing on the redirect back, making locals.user null — so the user appeared
    // logged out even though they had been authenticated before the payment. Setting sameSite: 'Lax' fixes this because
    // Lax allows cookies to be sent on top-level GET navigations from external sites (exactly what a payment gateway
    // redirect is), while still protecting against CSRF on cross-site POST requests.
    response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ httpOnly: true, sameSite: 'Lax'  }));

    return response;
};