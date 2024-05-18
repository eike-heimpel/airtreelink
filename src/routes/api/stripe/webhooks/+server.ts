import { error } from "@sveltejs/kit";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY, POSTMARK_API_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import postmark from "postmark";

const stripe = new Stripe(STRIPE_SECRET_KEY);
const supabaseService = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const postmarkClient = new postmark.ServerClient(POSTMARK_API_KEY);

/** @type {RequestHandler} */
export async function POST({ request, locals }) {

    const sig = request.headers.get('stripe-signature');
    const body = await request.text();

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        throw error(400, `Webhook signature verification failed: ${err.message}, received ${sig}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.user_id;
            const status = session.metadata?.plan;
            const subscriptionId = session.subscription as string;

            if (!userId) {
                console.error('No user_id in metadata for checkout.session.completed');
                throw error(400, 'No user_id in metadata for checkout.session.completed');
            }

            await handleSubscriptionUpdate(subscriptionId, userId, status);
            break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const subscriptionId = subscription.id;
            const status = subscription.status;

            await handleSubscriptionUpdate(subscriptionId, null, status);

            console.log(`Subscription ${subscriptionId} status updated to ${status}`);

            if (status === 'past_due') {
                await notifyUserBySubscription(subscriptionId, 'Payment Failed', generateEmailHtml('Payment Failure Notice', `
                    We wanted to inform you that your recent payment attempt has failed. Please update your payment information to avoid interruption of services.
                `));
            }

            if (status === 'canceled') {
                await handleSubscriptionCancellation(subscriptionId);
            }

            break;
        }

    }

    return new Response('Webhook received');
}

const generateEmailHtml = (title: string, body: string) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #ffffff;">
            <tr>
                <td style="text-align: center; padding: 10px 0;">
                    <img src="https://airtree.heimpel.family/logo.webp" alt="Your Company Logo" style="max-height: 50px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <h2 style="color: #333333; text-align: center;">${title}</h2>
                    <p style="color: #333333; font-size: 16px;">
                        Dear Customer,
                    </p>
                    <p style="color: #333333; font-size: 16px;">
                        ${body}
                    </p>
                    <p style="color: #333333; font-size: 16px;">
                        Thank you for choosing our service.
                    </p>
                    <p style="color: #333333; font-size: 16px;">
                        Best regards,
                    </p>
                    <p style="color: #333333; font-size: 16px; font-weight: bold;">
                        Your Airtree Team
                    </p>
                </td>
            </tr>
            <tr>
            <td style="text-align: center; padding: 20px;">
                <p style="color: #333333; font-size: 16px;">For support, please email us at <a href="mailto:support@heimpel.family" style="color: #007bff; text-decoration: none;">support@heimpel.family</a>.</p>
            </td>
            </tr>
            <tr>
                <td style="text-align: center; padding: 20px; color: #777777; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Airtree. All rights reserved. Airtree is a website by Eike Heimpel. Small business according to § 19 UStG.

                </td>
            </tr>
        </table>
    </div>
`;

const handleSubscriptionUpdate = async (subscriptionId: string, userId: string | null, status: string | null) => {
    if (userId) {
        console.log(`Updating user ${userId} subscription status to ${status}`);
    } else {
        console.log(`Updating subscription ${subscriptionId} status to ${status}`);
    }

    const updates = { subscription_status: status, last_updated: new Date().toISOString() };

    if (subscriptionId) {
        updates['subscription_id'] = subscriptionId;
    }

    const query = userId
        ? supabaseService.from('profile').update(updates).eq('id', userId)
        : supabaseService.from('profile').update(updates).eq('subscription_id', subscriptionId);

    const { data, error } = await query;

    if (error) {
        console.error(`Error updating user profile: ${error.message}`);
        return;
    }

    if (!userId && data?.length > 0) {
        userId = data[0].id;
    }

    if (userId) {
        const response = await supabaseService.from("profile").select("email").eq("id", userId);
        const email = response.data?.[0]?.email;

        if (email) {
            const subject = `Your Subscription Status: ${status}`;
            const html = generateEmailHtml('Subscription Status Update', `
                We wanted to inform you that your subscription status has been updated to <strong>${status}</strong>. If you have any questions or need further assistance, please don't hesitate to reach out to our support team.
            `);

            const postmarkResponse = await postmarkClient.sendEmail({
                From: "postmark@heimpel.family",
                To: email,
                Subject: subject,
                HtmlBody: html,
                MessageStream: "broadcast"
            });

            console.log(postmarkResponse);
        }
    }
};

const handleSubscriptionCancellation = async (subscriptionId: string) => {
    console.log(`Canceling subscription with ID: ${subscriptionId}`);

    const { data, error } = await supabaseService
        .from('profile')
        .update({ subscription_status: 'canceled', subscription_id: subscriptionId, last_updated: new Date().toISOString() })
        .eq('subscription_id', subscriptionId);

    if (error) {
        console.error(`Error canceling subscription in user profile: ${error.message}`);
        return;
    }

    const response = await supabaseService.from("profile").select("email").eq('subscription_id', subscriptionId);
    const email = response.data?.[0]?.email;

    console.log(response)

    if (email) {
        const subject = 'Your Subscription has been Canceled';
        const html = generateEmailHtml('Subscription Cancellation Notice', `
            We want to inform you that your subscription has been canceled. If you have any questions or need further assistance, please don't hesitate to reach out to our support team. We hope to serve you again in the future.
        `);

        const postmarkResponse = await postmarkClient.sendEmail({
            From: "postmark@heimpel.family",
            To: email,
            Subject: subject,
            HtmlBody: html,
            MessageStream: "broadcast"
        });

        console.log(postmarkResponse);
    }
};

const notifyUserBySubscription = async (subscriptionId: string, subject: string, html: string) => {
    const response = await supabaseService.from("profile").select("email").eq("subscription_id", subscriptionId);
    const email = response.data?.[0]?.email;

    if (email) {
        const postmarkResponse = await postmarkClient.sendEmail({
            From: "postmark@heimpel.family",
            To: email,
            Subject: subject,
            HtmlBody: html,
            MessageStream: "broadcast"
        });

        console.log(postmarkResponse);
    }
};
