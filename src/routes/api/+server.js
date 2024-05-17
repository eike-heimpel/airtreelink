import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    return redirect(303, "www.google.com")
};