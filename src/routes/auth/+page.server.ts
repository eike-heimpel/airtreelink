import { redirect, error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
const supabaseService = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);


export const actions: Actions = {
    login: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Check the profile status
        const { data: profile, error: profileError } = await supabaseService
            .from('profile')
            .select('*')
            .eq('email', email)
            .single();


        if (profileError || !profile) {
            console.error(profileError || 'Profile not found');
            return error(400, { message: 'Invalid email or password.' })
        }

        if (profile?.profile_status !== 'active') {
            return error(403, { message: `Your account is currently ${profile.profile_status}.` });
        }

        // Proceed with sign-in
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
            console.error(signInError);
            return error(400, { message: 'Invalid email or password.' });
        }

        return redirect(303, '/private');
    },
};
