// src/routes/sign-up/+server.ts

import { json, error } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { isSuspiciousEmail, isSuspiciousIP } from '$lib/utils/fraud-checks';
import type { RequestHandler } from './$types';

const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const { email, password } = await request.json();

    // Check for suspicious email
    if (await isSuspiciousEmail(email)) {
        console.log('Suspicious email detected');
        return json({ error: 'Suspicious email detected' }, { status: 400 });
    }

    const profile = await supabaseServiceClient.from('profile').select('id').eq('email', email);
    if (profile?.data.length !== 0) {
        console.log('profile already exists');
        return json({ signedUpAlready: true });
    }

    const resp = await supabase.auth.signUp({ email, password });

    if (resp.error) {
        console.log('error', resp.error);
        return error(resp.error.status, resp.error.message);
    }

    return json({ message: 'success' });
};
