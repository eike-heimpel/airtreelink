import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import type { Actions, PageServerLoad } from '../../account/$types';

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const { session } = await safeGetSession();
    if (!session) {
        throw redirect(303, '/login');
    }
    console.log(session.user.id);
    const { data: profile, error } = await supabase
        .from('profile')
        .select('subscription_status, profile_status, subscription_id')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error("Failed to load profile", error);
        return error(500, { error: 'Failed to load profile' });
    }

    return { session, profile };
};

export const actions: Actions = {
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

    cancelSubscription: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession();
        if (!session) {
            return error(403, { message: 'Not authenticated' });
        }

        const { data: profile, error: profileError } = await supabase
            .from('profile')
            .select('subscription_id')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile.subscription_id) {
            return error(400, { message: 'Subscription not found' });
        }

        try {
            const subscription = await stripe.subscriptions.update(
                profile.subscription_id,
                {
                    cancel_at_period_end: true,
                }
            );
        } catch (stripeError) {
            console.error("Failed to cancel Stripe subscription", stripeError);
            return error(500, { message: 'Failed to cancel subscription' });
        }

        const response = await supabase
            .from('profile')
            .update({ subscription_status: 'canceled' })
            .eq('id', session.user.id);

        if (response.error) {
            console.error("Failed to cancel subscription", response.error);
            return error(500, { message: 'Failed to cancel subscription' });
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
