import { fail, redirect } from '@sveltejs/kit'

export const load = async ({ locals: { session }, params }) => {

    if (!session) {
        throw redirect(303, '/auth')
    }
    if (session.user.id !== params.userId)
        throw redirect(303, '/private/' + session.user.id)



    return { session }
}
