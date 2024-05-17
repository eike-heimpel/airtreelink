import { redirect, error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    const userId = url.searchParams.get('userId');
    const plan = url.searchParams.get('plan');
    const baseUrl = `${url.protocol}//${url.host}`;

    if (!userId) {
        throw error(400, 'Missing user_id');
    }
    if (!plan) {
        throw error(400, 'Missing plan');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: 'price_1PHMswH6fmCpvtpqM5DIJI3p',
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/private/${userId}/account`,
        cancel_url: `${baseUrl}/`,
        metadata: {
            user_id: userId,
            plan: plan
        }
    });

    if (!session.url) {
        throw error(500, 'No session URL');
    }

    return redirect(303, session.url);
};
