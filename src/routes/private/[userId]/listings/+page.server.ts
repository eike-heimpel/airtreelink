import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
        const title_image_url = data.get('title_image_url');


        if (!name || !description || !title_image_url) {
            return fail(400, { error: 'All fields are required' });
        }

        try {
            const response = await locals.supabase
                .from('Listings')
                .insert([{ name, description, title_image_url, public: false, hash: "abc", listing_data: {} }]);

            console.log(response)
            if (response.error) {
                return fail(500, { error: 'Failed to add listing' });
            }
        } catch (error) {
            return fail(500, { error: 'An unexpected error occurred' });
        }

        // Optionally redirect to the listings page
        // throw redirect(303, '/listings');
    }
};
