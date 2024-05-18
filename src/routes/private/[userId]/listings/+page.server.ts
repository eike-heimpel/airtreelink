import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createHash, randomBytes } from 'crypto';

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
        const title_image_url = data.get('title_image_url');

        if (!name || !description || !title_image_url) {
            return fail(400, { error: 'All fields are required' });
        }

        const randomString = randomBytes(32).toString('hex');
        const hash = createHash('sha256').update(randomString).digest('base64'); // Generate a secure SHA-256 hash and encode in base64

        try {
            const response = await locals.supabase
                .from('Listings')
                .insert([{ name, description, title_image_url, public: false, hash, listing_data: {} }]);

            if (response.error) {
                return fail(500, { error: 'Failed to add listing' });
            }

            // Redirect to the new listing URL
            const listingId = response.data[0].id;
            throw redirect(303, `/public/listings/${listingId}?hash=${encodeURIComponent(hash)}`);
        } catch (error) {
            return fail(500, { error: 'An unexpected error occurred' });
        }

        return { success: true };
    }
};
