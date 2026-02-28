let userLoggedIn = false;
let isCurrentUserOwner = false;
let userFavoriteProperties = [];
let isInventoryInFavorites = false;

export async function load({ params, locals }) {
    userFavoriteProperties = locals.user?.favoriteProperties || [];
    if (locals?.user) {
        userLoggedIn = true;
        if (locals.user.pgPropertyId.includes(params.id) && locals.user.isOwner) {
            isCurrentUserOwner = true
        } else isCurrentUserOwner = false;
    } else userLoggedIn = false;
    try {
        if (userFavoriteProperties.includes(params.id)) {
            isInventoryInFavorites = true;
        } else {
            isInventoryInFavorites = false;
        }
        const pgProperty = await locals.pb.collection('pgProperties').getFirstListItem(`id="${params.id}"`)
        // console.log('isCurrentUserOwner',isCurrentUserOwner)
        return {
            pgProperty, isCurrentUserOwner, isInventoryInFavorites, userLoggedIn
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
    deleteInventory: async ({ params, locals }) => {
        if (!isCurrentUserOwner) return { deleteInventory: 'you are not authorized to deleted this property' };
        const propertyId = params.id;
        try {
            await locals.pb.collection('pgProperties').delete(propertyId);
            return { propertyDeleted : 'your property has been deleted successfully'};
        } catch (error) {
            // TO DO: handle error properly
            console.error("Failed to delete record:",error.response?.message);
            return fail(400, { errors: error.response?.message });
        }
    },

    addInventoryToFavorites: async ({ params, locals }) => {
        if (!locals.user) return { notLoggedIn: 'you need to be logged in to perform this action' };
        const propertyId = params.id;
        if (userFavoriteProperties.includes(propertyId)) {
            return { inventoryExistsInFavorites: 'property already exists in your favorites!' };
        } else {
            userFavoriteProperties.push(propertyId)
            try {
                const updatedUser = await locals.pb.collection('users').update(locals.user.id, { favoriteProperties : userFavoriteProperties });
                return { addedInventoryToFavorites: 'property has been added to your favorites!' };
            } catch (err) {
                // TO DO: handle error properly
                console.error("Failed to create record:", err.response?.data || err.message);
            }
        }
    },

    removeInventoryFromFavorites: async ({ params, locals }) => {
        console.log('removeInventoryFromFavorites action called');
        if (!locals.user) return { notLoggedIn: 'you need to be logged in to perform this action' };
        const propertyId = params.id;
        if (userFavoriteProperties.includes(propertyId)) {
            let updatedUserFavoriteProperties = userFavoriteProperties.filter( item => item !== propertyId);
            try {
                const updatedUser = await locals.pb.collection('users').update(locals.user.id, { favoriteProperties : updatedUserFavoriteProperties });
                return { removedInventoryFromFavorites: 'property has been removed from your favorites!' };
            } catch (err) {
                // TO DO: handle error properly
                console.error("Failed to create record:", err.response?.data || err.message);
            }
        } else {
            return { inventoryDoesNotExistsInFavorites: 'property does not exist in your favorites!' };
        }
    }
};