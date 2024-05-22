import { json, error } from '@sveltejs/kit';

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const { email, password } = await request.json();

    const resp = await supabase.auth.signUp({ email, password })

    if (resp.error) {
        return error(resp.error.status, resp.error.message)
    }

    return json({ message: 'success' })
}