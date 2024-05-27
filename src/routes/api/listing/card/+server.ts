// src/routes/api/updateHash/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';


export const PUT: RequestHandler = async ({ request, locals: { session, supabase } }) => {


    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { card } = await request.json();

    if (!card) {
        console.log("no card")
        throw error(400, 'Card is required');
    }



    const { data, error: cardError } = await supabase
        .from('listing_cards')
        .update({ ...card })
        .eq('user_id', session.user.id)
        .eq("id", card.id);

    if (cardError) {
        console.error('Error updating card:', cardError);
        throw error(500, 'Error updating card');
    }

    return json({ message: 'updated card successfully' });
};
