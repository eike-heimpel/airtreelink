import type { PageServerLoad } from "../../$types";

export const load: PageServerLoad = async ({ locals }) => {

    const listings = await locals.supabase.from('Listings').select('*').eq('user_id', locals.session.user.id)

    return {
        listings: listings.data
    }
}