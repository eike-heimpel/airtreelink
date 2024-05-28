
import { error } from "@sveltejs/kit";

import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';


const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

export const load = async ({ request, cookies, params, url, locals: { supabase } }) => {


    const lastUpdated = cookies.get('lastUpdated');
    const listingId = parseInt(params.listingId);

    const {data: currentListingInfo, error: listingError} = await supabaseServiceClient.from('Listings').select('*').eq('id', listingId).single();

    if (listingError) {
        throw error(404, "could not find listing page");
    }

    if (!currentListingInfo.public || currentListingInfo.hash !== url.searchParams.get('hash')) {
        throw error(403, 'Listing is private')
    }

    const { data: listingCards, error: listingCardsError } = await supabaseServiceClient.from('listing_cards').select('*').eq('listing_id', listingId);
    console.log(listingCards)

    if (listingCardsError) {
        throw error(500, "could not find listing info");
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


