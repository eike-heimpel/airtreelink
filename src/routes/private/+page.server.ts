import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from '../../account/$types'

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
    const { session } = await safeGetSession()
    if (!session) {
        throw redirect(303, '/')
    }

    redirect(303, '/private/' + session.user.id)
}