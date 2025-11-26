import { authPocketBaseInstanceWithPassword } from '$lib/server/pocketbase/pocketbase.js';

let isCurrentUserOwner = false
let userFavoriteProperties = []
export async function load({ params, locals }) {
    if (locals?.user && locals.user.pgPropertyId.includes(params.id) && locals.user.isOwner) {
       isCurrentUserOwner = true
       userFavoriteProperties = locals.user.favoriteProperties || [];
    } else isCurrentUserOwner = false;
    const pb = await authPocketBaseInstanceWithPassword();
    try {
        const pgProperty = await pb.collection('pgProperties').getFirstListItem(`id="${params.id}"`)
        console.log('isCurrentUserOwner',isCurrentUserOwner)
        return {
            pgProperty, isCurrentUserOwner
    };
    } catch (err) {
        // TO DO: handle error properly 
        console.error(
        "Failed to create record:",
        err.response?.data || err.message
      );
    }
}

export const actions = {
    deleteInventory: async ({ url }) => {
        const propertyId = url.searchParams.get("recordId");
        try {
            const pb = await authPocketBaseInstanceWithPassword();
            await pb.collection('pgProperties').delete(propertyId);
            return { propertyDeleted : 'your property has been deleted successfully'};
        } catch (error) {
            // TO DO: handle error properly
            console.error("Failed to delete record:",error.response?.data);
            return fail(400, { errors: error.response?.data });
        }
    },
    addInventoryToFavorites: async ({ url, locals }) => {
        if (!locals.user) {
            return { notLoggedIn: 'you need to be logged in to add to favorites' };
        } else {
            const propertyId = url.searchParams.get("recordId");
            if (userFavoriteProperties.includes(propertyId)) {
                return { inventoryExistsInFavorites: 'property already exists in your favorites!' };
            } else {
                userFavoriteProperties.push(propertyId)
                try {
                    const updatedUser = await locals.pb.collection('users').update(locals.user.id, { favoriteProperties : userFavoriteProperties });
                    return { addedInventoryToFavorites: 'property added to your favorites!' };
                } catch (err) {
                    // TO DO: handle error properly
                    console.error("Failed to create record:", err.response?.data || err.message);
                }
            }
        }
    }
};

// TO LEARN : if you remove the below line, then when you do a refresh on already loaded property 
// display page, it is throwing 500 error.
export const ssr = false