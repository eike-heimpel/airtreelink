
import { error } from "@sveltejs/kit";

import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';


const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

export const load = async ({ request, cookies, params, url, locals: { supabase } }) => {


    const listingId = parseInt(params.listingId);

    const {data: currentListingInfo, error: listingError} = await supabaseServiceClient.from('Listings').select('*').eq('id', listingId).single();

    if (listingError) {
        throw error(404, "could not find listing page");
    }


    const rawHash = url.searchParams.get('hash') || "";
    const urlHash = decodeURIComponent(rawHash.replace(/ /g, '+')); // replace space with + to avoid encoding issues
    
    if (!currentListingInfo.public || currentListingInfo.hash !== urlHash) {
        throw error(403, 'Listing is private')
    }

    const { data: listingCards, error: listingCardsError } = await supabaseServiceClient.from('listing_cards').select('*').eq('listing_id', listingId).order('sort_order', { ascending: true });

    if (listingCardsError) {
        throw error(500, "could not find listing info");
    }

     const cards = Object.values(listingCards);


    return { currentListingInfo, cards };
};


