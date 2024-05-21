import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
    // there is a redirect param, lets get it and redirect to that if it exists



    if (!locals.session) {
        return redirect(301, '/auth?error=unauthorized')
    }

    const { searchParams } = new URL(url);
    const redirectEndpoint = searchParams.get('redirect')

    if (redirectEndpoint) {
        throw redirect(301, `/private/${locals.session.user.id}/${redirectEndpoint}`)
    }

    throw redirect(301, `/private/${locals.session.user.id}/listings`)
}
