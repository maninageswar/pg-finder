import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
    const accountCreated = url.searchParams.get('accountCreated');
    return {
        accountCreated: accountCreated === 'true'
    };
}

export const actions = {
    login: async ({ locals, request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');
        try {
            const authData = await locals.pb.collection('users').authWithPassword(email, password);
            locals.user = authData.record;
            return { loginSuccess: true };
        } catch (err) {
            return fail(400, { error: 'invalid credentials' });
        }
    }
};