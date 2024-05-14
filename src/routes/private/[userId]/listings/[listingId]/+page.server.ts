import type { PageServerLoad, Actions } from "../../../$types";

export const load: PageServerLoad = async ({ }) => {

    return {
    }
}


export const actions: Actions = {

    default: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        const publicStatus = formData.get('public') === 'true'
        console.log(publicStatus)
        try {
            // Assuming `locals.supabase` is your Supabase client
            const response = await locals.supabase.from('Listings').update({ public: publicStatus }).eq('id', id)
            if (response.error) throw new Error(response.error.message);

            return { success: true };
        } catch (error) {
            console.log(error)
            return { error: error.message };
        }
    }
};