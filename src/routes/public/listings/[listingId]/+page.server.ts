import { error } from "@sveltejs/kit";
import type { Database } from '$lib/types/supabase';

type Listing = Database['public']['Tables']['Listings']['Row'];

export const load = async ({ locals, params, url }) => {

    let listing = await locals.supabase.from('Listings').select('*').eq('id', params.listingId)


    if (listing.data.length === 0) {
        throw error(404, 'Listing not found')
    }

    if (!listing.data[0].public || listing.data[0].hash !== url.searchParams.get('hash')) {
        throw error(403, 'Listing is private')
    }

    return {
        listing: listing.data[0] as Listing
    }
}