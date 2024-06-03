// src/routes/api/updateHash/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals: { session, supabase } }) => {
    console.log("sending")
    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const { card } = await request.json();


    // add user id to card
    card.user_id = session.user.id;
    // add created at to card
    card.last_changed = new Date().toISOString();


    if (!card) {
        console.log("no card")
        throw error(400, 'Card is required');
    }

    const { data, error: cardError } = await supabase
        .from('listing_cards')
        .insert(card);

    if (cardError) {
        console.error('Error updating card:', cardError);
        throw error(500, 'Error updating card');
    }

    return json({ message: 'updated card successfully' });
};



export const PUT: RequestHandler = async ({ request, locals: { session, supabase } }) => {
    if (!session) {
        throw error(401, 'Unauthorized');
    }


    const { cards } = await request.json();
    console.log(cards)

    if (!cards || !Array.isArray(cards)) {
        console.log("Invalid payload");
        throw error(400, 'Cards array is required');
    }

    const updates = cards.map((card) => {
        if (!card.id) {
            console.log("Card ID is required");
            throw error(400, 'Card ID is required');
        }

        const updateData = { ...card };
        delete updateData.id; // Remove id from the update data

        return supabase
            .from('listing_cards')
            .update(updateData) // Update only provided fields
            .eq('user_id', session.user.id)
            .eq('id', card.id);
    });

    try {
        const results = await Promise.all(updates);

        // Check for errors in any of the updates
        results.forEach(({ error: cardError }) => {
            if (cardError) {
                console.error('Error updating card:', cardError);
                throw error(500, 'Error updating card');
            }
        });

        return json({ message: 'Updated cards successfully' });
    } catch (err) {
        console.error('Error updating cards:', err);
        throw error(500, 'Error updating cards');
    }
};