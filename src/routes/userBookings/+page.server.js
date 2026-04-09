import { redirect } from '@sveltejs/kit';

export async function load({ locals, depends }) {
    if (!locals.user) {
        throw redirect(303, '/auth/login?authRequired=true');
    }
    try {
        const userBookings = await locals.pb.collection('bookingDetails').getFullList({
            filter: `userId="${locals.user.id}"`,
            expand: 'propertyId',
            fields: '*, expand.propertyId.id, expand.propertyId.pgAddress, expand.propertyId.pgCity, expand.propertyId.pgState, expand.propertyId.pgLocation'
        });
        // const userBookings = await locals.pb.collection('bookingDetails').getFullList({ filter: `userId="${123}"` });
        return { userBookings };
    } catch (error) {
        // TO DO: handle errors properly and show user friendly messages on the UI
        console.error("Failed to load user bookings:", error.status, error.message, error.response);
        return { loadError: 'failed to load your bookings, please try again later' };
    }
}

export const actions = {
    cancelBooking: async ({ url, locals }) => {
       const bookingId = url.searchParams.get('bookingId');
        try {
            const updatedBooking = await locals.pb.collection('bookingDetails').update(bookingId, { bookingStatus: 'cancelledByUser' });
            return { cancelledSuccessfully: 'your booking cancelled successfully', updatedBooking };
        } catch (error) {
            console.error("Failed to cancel booking:", error.status, error.message, error.response);
            return { cancelError: error.message || 'failed to cancel the booking' };
        }
    },
    checkIn: async ({ url, locals }) => {
        const bookingId = url.searchParams.get('bookingId');
        try {
            // update the stay status to checked in
            await locals.pb.collection('bookingDetails').update(bookingId, { stayStatus: 'checkedIn' });
            return { checkInSuccessfully: 'you have checked in successfully' };
        } catch (error) {
            console.error("Failed to check in:", error.status, error.message, error.response);
            return { checkInError: error.message || 'failed to check in' };
        }
    }
}