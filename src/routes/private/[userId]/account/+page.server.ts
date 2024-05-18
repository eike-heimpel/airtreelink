import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from '../../account/$types';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, parent }) => {

    const parentData = await parent();
    const session = parentData.session;

    if (!session || !session.user || !session.user.email) {
        throw error(403, { message: 'Not authenticated' });
    }

    let subscription;

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

    } catch (stripeError) {
        console.error('Failed to retrieve subscription from Stripe', stripeError);
        throw error(500, { message: 'Failed to retrieve subscription from Stripe' });
    }
    return { session, subscription };
};

export const actions: Actions = {

    signout: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession()
        if (session) {
            await supabase.auth.signOut()
            throw redirect(303, '/')
        }
    },

    changePassword: async ({ request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData();
        const newPassword = formData.get('newPassword') as string;

        const { session } = await safeGetSession();
        if (!session) {
            return error(403, { message: 'Not authenticated' });
        }

        const response = await supabase.auth.updateUser({
            password: newPassword
        });

        if (response.error) {
            console.error("Failed to change password", response.error);
            return error(500, { message: 'Failed to change password' });
        }

        return { success: true };
    },

    deleteAccount: async ({ request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        const { session } = await safeGetSession();
        if (!session) {
            return error(403, { message: 'Not authenticated' });
        }

        if (email !== session.user.email) {
            return error(400, { message: 'Email confirmation does not match' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('subscription_status')
            .eq('id', session.user.id)
            .single();

        if (profileError || (profile && profile.subscription_status !== 'canceled')) {
            return error(400, { message: 'You must cancel your subscription before deleting your account' });
        }

        const response = await supabase
            .from('profile')
            .update({ profile_status: 'scheduled for deletion' })
            .eq('id', session.user.id);

        if (response.error) {
            console.error("Failed to schedule account deletion", response.error);
            return error(500, { message: 'Failed to schedule account deletion' });
        }

        // Log the user out
        await supabase.auth.signOut();

        return { message: 'Account deletion scheduled. Your account and all associated data will be deleted within 30 days, unless required by law to retain it.' };
    }
};
