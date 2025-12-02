import { fail, redirect } from '@sveltejs/kit';

let userId = null;
export async function load({ params, locals }) {
    if (locals.user) {
       userId = locals.user.id
       return { userProfile: locals.user, isCurrentUserOwner: locals.user.isOwner };
    } else {
        throw redirect(303, '/auth/login?authRequired=true');
    }
}

export const actions = {
    updateUserProfile: async ({ request, locals }) => {
		const formData = await request.formData();
        const mobileNumber = formData.get('mobileNumber');
        const emergencyContactNumber = formData.get('emergencyContactNumber');
        if (!mobileNumber) {
            return fail(400, { errors: { mobileNumber: 'please update your mobile nunber to update your profile' } });
        }
        if (!emergencyContactNumber) {
            return fail(400, { errors: { emergencyContactNumber: 'please update your emergency contact number to update your profile' } });
        }
        try {
            const userProfile = await locals.pb.collection('users').update(userId, formData);
            return { userProfile };
        } catch (error) {
            return fail(400, { errors: error.response });
        }
	},

    logout: async ({ locals, cookies }) => {
		try {
			locals.pb.authStore.clear();
			locals.user = null;
			return {logout: true}
		} catch (error) {
			return fail(400, { errors: { logoutError: 'failed to logout' }});
		}
	}
};