
import { error } from "@sveltejs/kit";
import { all } from "axios";

export const load = async ({ request, cookies, parent, params, locals: { supabase, session } }) => {
    const lastUpdated = cookies.get('lastUpdated');
    console.log("lastUpdated", lastUpdated);
    const listingId = parseInt(params.listingId);

    const parents = await parent();
    const currentListingInfo = parents.listings.find(listing => listing.id === listingId);

    const { data: listingCards, error: listingCardsError } = await supabase.from('listing_cards').select('*').eq('listing_id', listingId);

    if (listingCardsError) {
        throw error(500, listingCardsError);
    }
    let modifiedCards = [];

    if (!lastUpdated) {
        modifiedCards = Object.values(listingCards);
    } else {
        modifiedCards = Object.values(listingCards).filter(card => new Date(card.last_changed) > new Date(lastUpdated));
    }

    // Collect all card IDs
    const allCardIds = listingCards.map(card => card.id);

    cookies.set('lastUpdated', new Date().toISOString(), { path: '/' });

    return { currentListingInfo, modifiedCards, lastChanged: new Date().toISOString(), allCardIds };
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
    },

    deleteCard: async ({ request, locals }) => {
        const formData = await request.formData();
        const cardId = parseInt(formData.get('cardId')?.toString() || '');

        if (!cardId) {
            error(400, { message: 'Invalid card id' });
        }

        const { data: card, error: cardError } = await locals.supabase.from('listing_cards').delete().eq('id', cardId);

        if (cardError) {
            return error(500, { message: 'Failed to delete card' });
        }

        console.log("card deleted")
        return { success: true };



    },
    updateCard: async ({ request, locals }) => {
    },
    addCard: async ({ request, locals }) => {
    }

};
