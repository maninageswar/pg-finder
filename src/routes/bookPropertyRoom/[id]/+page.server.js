import { updated } from '$app/state';

export const actions = {
    makeRoomBookingRequest: async ({ request, locals }) => {
        if (!locals.user) {
            return { notAuthenticated: 'you need to login to make a booking request' };
        }
        const formData = await request.formData();
        let bookingRecord;
        
        try {
            bookingRecord = await locals.pb.collection("bookingDetails").create(formData);   
        } catch (error) {
            console.error("Failed to create bookingRecord:", error);
            return { bookingRequestFailed: 'failed to make booking request, please try again later' };
        }
        console.log("Record created:", bookingRecord);
        if (bookingRecord && bookingRecord.id) {
            const userDataToUpdate = {
                "mobileNumber": formData.get('mobileNumber'),
                "emergencyContactNumber": formData.get('emergencyContactNumber'),
                // TO DO (important) : update the  propertyId in the users table only 
                "pgPropertyId": formData.get('propertyId'),
                "bookingId": bookingRecord.id
            }
            try {
                const updatedUserRecord = await locals.pb.collection("users").update(formData.get('userId'), userDataToUpdate);
                console.log("User Record updated with booking details:", updatedUserRecord);
            } catch (error) {
                console.error("Failed to update user record with booking details:", error);
                return { bookingRequestFailed: 'booking request was made but failed to update user details with booking information' };
            }
        }
        if (bookingRecord && updated) {
            return { bookingRequestMade: 'your booking request has been sent to the owner, you can view the status of your booking request in this manage inventory page' };
        } else {
            return { bookingRequestFailed: 'either the booking request or the user update failed' };
        }
    }
};