// src/routes/api/updateHash/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { randomBytes, createHash } from 'crypto';

export const POST: RequestHandler = async ({ request, locals: { session, supabase } }) => {

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { listingId } = await request.json();

    if (!listingId) {
        throw error(400, 'Listing ID is required');
    }

    // Generate a secure SHA-256 hash and encode in base64
    const randomString = randomBytes(32).toString('hex');
    const newHash = createHash('sha256').update(randomString).digest('base64');

    const { data, error: ListingError } = await supabase
        .from('Listings')
        .update({ hash: newHash })
        .eq('id', listingId)
        .eq('user_id', session.user.id);

    if (ListingError) {
        console.error('Error updating hash:', ListingError);
        throw error(500, 'Error updating hash');
    }

    return json({ message: 'Hash updated successfully' });
};
