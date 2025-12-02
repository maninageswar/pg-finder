export async function load({ params, locals }) {
    try {
        const pgInventories = await locals.pb.collection('pgProperties').getList(1, 50);
        return {pgInventories, user : locals.user
    };
    } catch (err) {
        console.error("Failed to create record:", err.response?.data || err.message);
    }
}

export const ssr = false