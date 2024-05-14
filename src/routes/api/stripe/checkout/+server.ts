import { redirect, error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY } from "$env/static/private";
import Stripe from "stripe";
import type { RequestHandler } from './$types'

const stripe = new Stripe(STRIPE_SECRET_KEY);


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {

    const baseUrl = `${url.protocol}//${url.host}`;
    console.log(baseUrl)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: 'price_1PGMZ9H6fmCpvtpqBvDlEuNW',
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/private`,
        cancel_url: `${baseUrl}/`,
    });

    if (!session.url) {
        console.log("no session url")
        throw new Error('No session URL');
    }
    return redirect(303, session.url);
};
