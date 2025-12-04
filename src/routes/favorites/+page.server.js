import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if (!locals.user) { throw redirect(303, '/auth/login?authRequired=true'); }
    let userFavoritesPropertiesList = locals.user.favoriteProperties || [];
    let userFavoritesProperties = [];
    for (const pgId of userFavoritesPropertiesList) {
        try {
            const pgProperty = await locals.pb.collection('pgProperties').getFirstListItem(`id="${pgId}"`);
            userFavoritesProperties.push(pgProperty);
        } catch (err) {
            // TO DO: handle error properly 
            console.error("Failed to fetch record:", err.response?.data || err.message
            );
        }
    }
    return {
        userFavoritesProperties
    };
}

export const ssr = false