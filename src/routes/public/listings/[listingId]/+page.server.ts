
import { error } from "@sveltejs/kit";
import { all } from "axios";


export const load = async ({ request, cookies, params, locals: { supabase } }) => {


    const lastUpdated = cookies.get('lastUpdated');
    const listingId = parseInt(params.listingId);

    const {data: currentListingInfo} = await supabase.from('Listings').select('*').eq('id', listingId).single();

    const { data: listingCards, error: listingCardsError } = await supabase.from('listing_cards').select('*').eq('listing_id', listingId);
    console.log(listingCards)

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


