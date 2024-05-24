import { STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_STRIPE_PRODUCT_ID } from '$env/static/public';
import Stripe from 'stripe';
import { error } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const load = async ({ locals: { session, supabase } }) => {

    if (!session || !session.user || !session.user.email) {
        throw error(403, { message: 'Not authenticated' });
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

    let subscription = null;

    try {
        const customer = await stripe.customers.list({
            email: session.user.email,
            limit: 1
        });

        if (customer.data.length === 0) {
            throw error(404, { message: 'Customer not found' });
        }

        const { data: subscriptions } = await stripe.subscriptions.list({
            customer: customer.data[0].id,
            limit: 1
        });

        subscription = subscriptions.find(subscription => subscription.plan.product === PUBLIC_STRIPE_PRODUCT_ID) as Stripe.Subscription

        if (!subscription) {
            console.log('Subscription not found');
        }

    } catch (stripeError) {
        console.error('Failed to retrieve subscription from Stripe', stripeError);
    }

    return { subscription, publicListingCount };
};

export const actions = {
    updateSubscription: async ({ request, locals: { session } }) => {

        if (!session || !session.user || !session.user.email) {
            throw error(403, { message: 'Not authenticated' });
        }

        const formData = await request.formData();
        const newQuantity = parseInt(formData.get('newQuantity'));

        if (isNaN(newQuantity) || newQuantity < 1) {
            throw error(400, { message: 'Invalid quantity' });
        }

        let subscription = null;

        try {
            const customer = await stripe.customers.list({
                email: session.user.email,
                limit: 1
            });

            if (customer.data.length === 0) {
                throw error(404, { message: 'Customer not found' });
            }

            const subscriptions = await stripe.subscriptions.list({
                customer: customer.data[0].id,
                limit: 1
            });

            if (subscriptions.data.length === 0) {
                throw error(404, { message: 'Subscription not found' });
            }

            subscription = subscriptions.data[0];

            await stripe.subscriptions.update(subscription.id, {
                items: [{
                    id: subscription.items.data[0].id,
                    quantity: newQuantity,
                }],
                proration_behavior: 'create_prorations',
            });
        } catch (stripeError) {
            console.error('Failed to update Stripe subscription', stripeError);
            throw error(500, { message: 'Failed to update subscription' });
        }

        return { success: true };
    },

    cancelSubscription: async ({ locals: { session } }) => {

        if (!session || !session.user || !session.user.email) {
            throw error(403, { message: 'Not authenticated' });
        }

        let subscription = null;

        try {
            const customer = await stripe.customers.list({
                email: session.user.email,
                limit: 1
            });

            if (customer.data.length === 0) {
                throw error(404, { message: 'Customer not found' });
            }

            const subscriptions = await stripe.subscriptions.list({
                customer: customer.data[0].id,
                limit: 1
            });

            if (subscriptions.data.length === 0) {
                throw error(404, { message: 'Subscription not found' });
            }

            subscription = subscriptions.data[0];

            await stripe.subscriptions.update(subscription.id, {
                cancel_at_period_end: true,
            });
        } catch (stripeError) {
            console.error('Failed to cancel Stripe subscription', stripeError);
            throw error(500, { message: 'Failed to cancel subscription' });
        }
        return { success: true };
    },

    renewSubscription: async ({ request, locals: { session } }) => {

        if (!session || !session.user || !session.user.email) {
            throw error(403, { message: 'Not authenticated' });
        }


        let subscription = null;

        try {
            const customer = await stripe.customers.list({
                email: session.user.email,
                limit: 1
            });

            if (customer.data.length === 0) {
                throw error(404, { message: 'Customer not found' });
            }

            const subscriptions = await stripe.subscriptions.list({
                customer: customer.data[0].id,
                limit: 1
            });

            if (subscriptions.data.length === 0) {
                throw error(404, { message: 'Subscription not found' });
            }

            subscription = subscriptions.data[0];

            if (subscription.cancel_at_period_end) {
                await stripe.subscriptions.update(subscription.id, {
                    cancel_at_period_end: false,
                });
            } else {
                throw error(400, { message: 'Subscription is not set to cancel' });
            }
        } catch (stripeError) {
            console.error('Failed to renew Stripe subscription', stripeError);
            throw error(500, { message: 'Failed to renew subscription' });
        }

        return { success: true };
    }
};
