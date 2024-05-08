import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();

    if (session) {
        throw redirect(303, "/private/" + session.user.id);
    }

    else {
        throw redirect(303, '/auth');
    }
};