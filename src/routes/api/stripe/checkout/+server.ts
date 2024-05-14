// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.

import { redirect } from "@sveltejs/kit";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_Y17KokhC3SRYCQTLYiU5ZCD2");


/** @type {import('./$types').RequestHandler} */
export async function GET() {

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: '123',
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `/pricing`,
        cancel_url: `/`,
    });

    if (!session.url)
        throw new Error('No session URL');

    throw redirect(303, session.url);
};