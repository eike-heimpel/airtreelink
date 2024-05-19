import { error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

/** @type {RequestHandler} */
export async function POST({ request }) {
    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw error(400, `Webhook signature verification failed: ${err.message}, received ${sig}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                // Add any additional logic if needed, otherwise just log
                console.log('Checkout session completed');
                break;
            }
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                // Add any additional logic if needed, otherwise just log
                console.log(`Subscription event received: ${event.type}`);
                break;
            }
            default:
                console.warn(`Unhandled event type ${event.type}`);
        }
    } catch (err) {
        console.error(`Error handling event: ${err.message}`);
        // Report error to Stripe
        throw error(500, `Error handling event: ${err.message}`);
    }

    return new Response('Webhook received');
}
