import { redirect } from '@sveltejs/kit';
import filter from 'svelte-select/filter';

export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, '/auth/login?authRequired=true');
    }
    try {
        // const userBookedProperty = await locals.pb.collection('bookingDetails').getFirstListItem(`userId=${locals.user.id}`);
        const userBookedProperty = await locals.pb.collection('bookingDetails').getFullList(`userId="${locals.user.id}"`,{
            filter: 'bookingStatus="booked"',
        });
        console.log('userBookedProperty', userBookedProperty);
        return { userBookedProperty };
    } catch (error) {
        console.error("Failed to load user inventory:", error);
        return { loadError: 'failed to load your inventory, please try again later' };
    }
}