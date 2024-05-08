import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {

    console.log(`/private/${locals.session.user.id}/listings`)
    throw redirect(301, `/private/${locals.session.user.id}/listings`)
}
