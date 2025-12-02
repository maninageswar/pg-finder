import PocketBase from "pocketbase";
import { POCKETBASE_USER_NAME, POCKETBASE_PASSWORD } from "$env/static/private";
import { PUBLIC_POCKETBASE_SERVER_URL } from "$env/static/public";

export function createPocketBaseInstance() {
    return new PocketBase(PUBLIC_POCKETBASE_SERVER_URL)
}

// TO KNOW: currently the below function is no longer uses as we are using locals variable the is created in hooks.server.js 
// file and is being used across the applicatioin but i'm not deleting this FILE as it might be useful later
export async function authPocketBaseInstanceWithPassword() {
    const pb = createPocketBaseInstance();
    await pb.admins.authWithPassword(POCKETBASE_USER_NAME,POCKETBASE_PASSWORD);
    return pb;
}