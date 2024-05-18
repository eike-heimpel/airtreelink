import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY);
import { error } from '@sveltejs/kit';
export const load = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) {
        throw error(403, { message: 'Not authenticated' });
    }

    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select('subscription_id')
        .eq('id', session.user.id)
        .single();


    if (profileError) {
        throw error(500, { message: 'Failed to load profile' });
    }

    let subscription = null;
    if (profile.subscription_id) {
        try {
            subscription = await stripe.subscriptions.retrieve(profile.subscription_id);
        } catch (stripeError) {
            throw error(500, { message: 'Failed to retrieve subscription from Stripe' });
        }
    }
    return { profile, subscription };
};

export const actions = {
    updateSubscription: async ({ request, locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw error(403, { message: 'Not authenticated' });
        }

        const formData = await request.formData();
        const newQuantity = parseInt(formData.get('newQuantity'));

        if (isNaN(newQuantity) || newQuantity < 1) {
            throw error(400, { message: 'Invalid quantity' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('subscription_id, subscription_item_id')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile.subscription_id) {
            throw error(400, { message: 'Subscription not found' });
        }

        try {
            await stripe.subscriptions.update(profile.subscription_id, {
                items: [{
                    id: profile.subscription_item_id,
                    quantity: newQuantity,
                }],
                proration_behavior: 'create_prorations',
            });
        } catch (stripeError) {
            console.error('Failed to update Stripe subscription', stripeError);
            throw error(500, { message: 'Failed to update subscription' });
        }

        const { error: updateError } = await supabase
            .from('profile')
            .update({ subscription_quantity: newQuantity })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Failed to update subscription quantity in database', updateError);
            throw error(500, { message: 'Failed to update subscription' });
        }

        return { success: true };
    },

    cancelSubscription: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            throw error(403, { message: 'Not authenticated' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('subscription_id')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile.subscription_id) {
            throw error(400, { message: 'Subscription not found' });
        }

        try {
            await stripe.subscriptions.update(profile.subscription_id, {
                cancel_at_period_end: true,
            });
        } catch (stripeError) {
            console.error('Failed to cancel Stripe subscription', stripeError);
            throw error(500, { message: 'Failed to cancel subscription' });
        }

        const { error: updateError } = await supabase
            .from('profile')
            .update({ subscription_status: 'canceled' })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Failed to update subscription status in database', updateError);
            throw error(500, { message: 'Failed to update subscription' });
        }

        return { success: true };
    },
};