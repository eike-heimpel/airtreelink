import type { PageServerLoad, Actions } from "../../../$types";

export const load: PageServerLoad = async ({ params, locals }) => {
    const listingId = parseInt(params.listingId);
    const { data: listings, error } = await locals.supabase.from('Listings').select('*').eq('id', listingId);
    if (error) {
        throw new Error(error.message);
    }
    return {
        listings
    };
};

export const actions: Actions = {
    publish: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        const publicStatus = formData.get('public') === 'true';
        try {
            const response = await locals.supabase.from('Listings').update({ public: publicStatus }).eq('id', id);
            if (response.error) throw new Error(response.error.message);
            return { success: true };
        } catch (error) {
            return { error: error.message };
        }
    },
    delete: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));

        try {
            const response = await locals.supabase.from('Listings').delete().eq('id', id);

            if (response.error) throw new Error(response.error.message);
            return { success: true };
        } catch (error) {
            console.log("could not delete listing", error);
            return { error: error.message };
        }
    }
};
