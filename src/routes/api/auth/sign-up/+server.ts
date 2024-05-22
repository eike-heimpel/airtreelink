import { json, error } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';


const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
})

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
    const { email, password } = await request.json();

    const resp = await supabase.auth.signUp({ email, password })

    // check if the email is already taken
    const profile = await supabaseServiceClient.from('profile').select('id').eq('email', email)
    console.log(profile)

    if (profile?.data.length !== 0) {
        console.log('profile already exists')
        return json({ signedUpAlready: true })
    }
    if (profile.error) {
        console.log(profile.error)
        return error(500, profile.error.message)
    }
    if (resp.error) {
        console.log(resp.error)
        return error(resp.error.status, resp.error.message)
    }

    return json({ message: 'success' })
}