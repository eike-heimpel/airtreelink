import { redirect, error } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET({ url, locals }) {

    if (!locals.session || !locals.session.user || !locals.session.user.email) {
        throw error(403, { message: 'Not authenticated' });
    }

    const customerEmail = locals.session.user.email;
    const userId = locals.session.user.id;

    const priceId = url.searchParams.get('price_id');
    const quantity = url.searchParams.get('quantity') || 1;
    const baseUrl = `${url.protocol}//${url.host}`;

    if (!userId) {
        throw error(400, 'Missing user_id');
    }
    if (!priceId) {
        throw error(400, 'Missing plan');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: Number(quantity),
            },
        ],
        customer_email: customerEmail,
        mode: 'subscription',
        success_url: `${baseUrl}/private/${userId}/account`,
        cancel_url: `${baseUrl}/`,
        metadata: {
            user_id: userId,
        }
    });


    if (!session.url) {
        throw error(500, 'No session URL');
    }

    return redirect(303, session.url);
}
