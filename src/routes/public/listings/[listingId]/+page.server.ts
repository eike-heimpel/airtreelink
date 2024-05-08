import type { PageServerLoad } from "$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, params, url }) => {

    let listing = await locals.supabase.from('Listings').select('*').eq('id', params.listingId)

    console.log(listing)

    if (listing.data.length === 0) {
        throw error(404, 'Listing not found')
    }

    if (!listing.data[0].public || listing.data[0].hash !== url.searchParams.get('hash')) {
        throw error(403, 'Listing is private')
    }

    return {
        listing
    }
}