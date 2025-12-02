let isCurrentUserOwner = false
let userFavoriteProperties = []

export async function load({ params, locals }) {
    userFavoriteProperties = locals.user?.favoriteProperties || [];
    if (locals?.user && locals.user.pgPropertyId.includes(params.id) && locals.user.isOwner) {
       isCurrentUserOwner = true
    } else isCurrentUserOwner = false;
    try {
        const pgProperty = await locals.pb.collection('pgProperties').getFirstListItem(`id="${params.id}"`)
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
    deleteInventory: async ({ url, locals }) => {
        if (!isCurrentUserOwner) return { deleteInventory: 'you are not authorized to deleted this property' };
        const propertyId = url.searchParams.get("recordId");
        try {
            await locals.pb.collection('pgProperties').delete(propertyId);
            return { propertyDeleted : 'your property has been deleted successfully'};
        } catch (error) {
            // TO DO: handle error properly
            console.error("Failed to delete record:",error.response?.message);
            return fail(400, { errors: error.response?.message });
        }
    },

    addInventoryToFavorites: async ({ url, locals }) => {
        if (!locals.user) return { notLoggedIn: 'you need to be logged in to add to favorites' };
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
};

// TO LEARN : if you remove the below line, then when you do a refresh on already loaded property 
// display page, it is throwing 500 error.
export const ssr = false