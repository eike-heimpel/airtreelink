import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createHash, randomBytes } from 'crypto';


export const load = async ({ locals: { session }, parent }) => {

    const parentData = await parent();

    if (!session || !session.user || !session.user.email) {
        throw error(403, { message: 'Not authenticated' });
    }

    return { listings: parentData.listings };

}


export const actions: Actions = {
    default: async ({ request, locals }) => {

        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
        const title_image_url = data.get('title_image_url');

        if (!name || !description || !title_image_url) {
            return error(400, { message: 'All fields are required' });
        }

        const randomString = randomBytes(32).toString('hex');
        const hash = createHash('sha256').update(randomString).digest('base64'); // Generate a secure SHA-256 hash and encode in base64

        try {
            const response = await locals.supabase
                .from('Listings')
                .insert([{ name, description, title_image_url, public: false, hash, listing_data: {} }]);

            if (response.error) {
                return error(500, { message: 'Failed to add listing' });
            }

            return { success: true };
        } catch (err) {
            console.error('Unexpected error:', err);
            return error(500, { message: 'An unexpected error occurred' });
        }

    }

};
