
import { error } from "@sveltejs/kit";


export const load = async ({ request, cookies, parent, params, locals: { supabase, session } }) => {

    const lastUpdated = cookies.get('lastUpdated');

    const listingId = parseInt(params.listingId)

    const parents = await parent();
    const currentListing = parents.listings.find(listing => listing.id === listingId);

    const { data: listingCards, error: listingCardsError } = await supabase.from('listing_cards').select('*').eq("listing_id", listingId);

    if (listingCardsError) {
        throw error(500, listingCardsError);
    }


    let modifiedCards = []

    if (!lastUpdated) {
        modifiedCards = Object.values(listingCards);
    } else {
        modifiedCards = Object.values(listingCards).filter(card => new Date(card.last_changed) > new Date(lastUpdated));
    }
    console.log("Modified cards", modifiedCards.length)

    cookies.set('lastUpdated', new Date().toISOString(), { path: '/' });

    return { currentListing, modifiedCards, lastChanged: new Date().toISOString() };

};


export const actions = {

    publish: async ({ request, locals }) => {
        const formData = await request.formData();

        const id = parseInt(formData.get('id')?.toString() || '');

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

        const id = parseInt(formData.get('id')?.toString() || '');

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
