import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';
import { error } from '@sveltejs/kit';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const load = async ({ parent }) => {
    const parentData = await parent();
    const session = parentData.session;

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
            console.log('Subscription not found');
        } else subscription = subscriptions.data[0];


    } catch (stripeError) {
        console.error('Failed to retrieve subscription from Stripe', stripeError);
        throw error(500, { message: 'Failed to retrieve subscription from Stripe' });
    }

    return { subscription };
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
};
