import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_STRIPE_PRODUCT_ID } from '$env/static/public';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const GET: RequestHandler = async ({ request, locals: { session, supabase } }) => {
    if (!session || !session.user || !session.user.email) {
        throw error(401, 'Unauthorized');
    }

    // Get public_listings count from supabase for the user by session user id
    const { data: publicListings, error: publicListingsError } = await supabase
        .from('Listings')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('public', true)

    if (publicListingsError) {
        console.error('Error fetching user:', publicListingsError);
        throw error(500, 'Error fetching user');
    }

    if (!publicListings) {
        throw error(404, 'No listings found');
    }

    const publicListingCount = publicListings.length;

    // Get the number of subscriptions for the user from Stripe
    const { data: customers, error: stripeError } = await stripe.customers.list({
        email: session.user.email,
        limit: 1
    });

    if (stripeError) {
        console.error('Error fetching subscriptions:', stripeError);
        throw error(500, 'Error fetching subscriptions');
    }

    const customer = customers[0];

    if (!customer) {
        throw error(404, 'Customer not found');
    }

    const { data: subscriptions } = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active'
    });

    let subscriptionCount = 0;

    try {
        // find correct subscription in subscriptions with plan.product === PUBLIC_STRIPE_PRODUCT_ID
        const subscription = subscriptions.find(subscription => subscription.plan.product === PUBLIC_STRIPE_PRODUCT_ID) as Stripe.Subscription
        subscriptionCount = subscription.quantity;
    } catch (err) {
        console.error('Error fetching subscriptions:', err);
        throw error(500, 'Error fetching subscriptions');
    }

    // Compare the subscription count with the listing count
    const canPublishMoreListings = subscriptionCount > publicListingCount;

    return json({ canPublishMoreListings, subscriptionCount, publicListingCount });
};
