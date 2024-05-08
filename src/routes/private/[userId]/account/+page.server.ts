import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from '../../account/$types'

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession }, params }) => {
    const { session } = await safeGetSession()

    if (!session) {
        throw redirect(303, '/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(`username, full_name, website, avatar_url`)
        .eq('id', session.user.id)
        .single()

    return { session, profile }
}

export const actions: Actions = {
    update: async ({ request, locals: { supabase, safeGetSession } }) => {
        const formData = await request.formData()
        const fullName = formData.get('fullName') as string
        const username = formData.get('username') as string

        const { session } = await safeGetSession()
        console.log("inserting")
        const { error } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            full_name: fullName,
            username,
            updated_at: new Date(),
        })

        if (error) {
            return fail(500, {
                fullName,
                username,
            })
        }

        return {
            fullName,
            username,
        }
    },
    signout: async ({ locals: { supabase, safeGetSession } }) => {
        const { session } = await safeGetSession()
        if (session) {
            await supabase.auth.signOut()
            throw redirect(303, '/')
        }
    },
}
