
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import Stripe from "stripe";
import { json, error } from '@sveltejs/kit';
import { isSuspiciousEmail, isHighRiskCountry } from '$lib/utils/fraud-checks';
import { createServerClient } from '@supabase/ssr';


const supabaseServiceClient = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    cookies: {}
});

const stripe = new Stripe(STRIPE_SECRET_KEY);

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals: { supabase } }): Promise<Response> => {
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
        error(400, 'Stripe signature missing');
    }

    let event: Stripe.Event;

    try {
        const body = await request.text();
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        error(400, 'Webhook signature verification failed');
    }


    let customer_email = null;

    if (event.data.object.customer) {
        const customer = await stripe.customers.retrieve(event.data.object.customer);
        customer_email = customer.email;
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const email = paymentIntent.receipt_email || paymentIntent.metadata.customer_email;
            const ipAddress = paymentIntent.metadata.ip_address;
            const country = paymentIntent.metadata.country;
            const customerId = paymentIntent.customer;

            if (
                await isSuspiciousEmail(email) ||
                isHighRiskCountry(country) ||
                (await isVelocityExceeded(customerId))
            ) {
                try {
                    // Check if the PaymentIntent requires capture (not yet completed)
                    if (paymentIntent.status === 'requires_capture') {
                        await stripe.paymentIntents.cancel(paymentIntent.id);

                        console.log(`Cancelled suspicious payment intent: ${paymentIntent.id}`);
                    }
                    // If already captured, refund the payment intent
                    else if (paymentIntent.status === 'succeeded') {
                        await stripe.refunds.create({
                            payment_intent: paymentIntent.id
                        });

                        console.log(`Refunded suspicious payment intent: ${paymentIntent.id}`);
                    }
                } catch (err) {
                    if (err.type === 'StripeInvalidRequestError' && err.message.includes('No such payment_intent')) {
                        console.error(`Failed to cancel or refund payment intent: ${paymentIntent.id}. Reason: ${err.message}`);
                    } else {
                        console.error(`Failed to handle payment intent for event ${event.type}: ${paymentIntent.id}`, err);
                    }
                }
            }
            break;
        }

        case 'charge.succeeded': {
            const charge = event.data.object as Stripe.Charge;

            const email = charge.receipt_email || charge.billing_details.email;
            const ipAddress = charge.metadata.ip_address;
            const country = charge.metadata.country;
            const customerId = charge.customer;
            charge.invoice

            let subscriptionId

            if (charge.invoice) {
                try {
                    const invoice = await stripe.invoices.retrieve(charge.invoice as string);
                    subscriptionId = invoice?.subscription;
                } catch (error) {
                    console.error(`Failed to retrieve invoice: ${error.message}`);
                }
            } else {
                console.log('No invoice found for this charge.');
            }


            if (
                await isSuspiciousEmail(email) ||
                isHighRiskCountry(country) ||
                (await isVelocityExceeded(customerId))
            ) {
                try {
                    const refundResp = await stripe.refunds.create({
                        charge: charge.id
                    });

                    if (refundResp.status !== 'succeeded') {
                        throw new Error(`Failed to refund charge: ${charge.id}`);
                    }

                    console.log(`Refunded suspicious charge: ${charge.id}`);

                    if (subscriptionId) {
                        const cancelResp = await stripe.subscriptions.cancel(subscriptionId as string) as Stripe.Subscription;
                        if (cancelResp.status !== 'canceled') {
                            throw new Error(`Failed to cancel subscription: ${subscriptionId}`);
                        }
                    } else {
                        console.warn(`No subscription ID found for charge: ${charge.id}`);
                    }

                } catch (err: any) {
                    if (err.type === 'StripeInvalidRequestError' && err.message.includes('No such charge')) {
                        console.error(`Failed to refund charge: ${charge.id}. Reason: ${err.message}`);
                    } else {
                        console.error(`Failed to handle charge.succeeded for event ${event.type}: ${charge.id}`, err);
                    }
                }
            }
        }
        case 'charge.refunded': {
            const refund = event.data.object;
            const { error } = await supabaseServiceClient.from('refund_logs').insert([{
                event_type: 'charge.refunded',
                charge_id: refund.id,
                amount: refund.amount,
                created_at: new Date(refund.created * 1000).toISOString(),
                status: refund.status,
                description: refund.description || null,
                customer_email: refund.receipt_email || customer_email
            }]);
            if (error) {
                console.error('Error logging charge.refunded event:', error);
            } else {
                console.log('Logged charge.refunded event');
            }
            break;
        }
        case 'charge.refund.updated': {
            const refund = event.data.object;
            const { error } = await supabaseServiceClient.from('refund_logs').insert([{
                event_type: 'charge.refund.updated',
                charge_id: refund.id,
                amount: refund.amount,
                status: refund.status,
                created_at: new Date(refund.created * 1000).toISOString(),
                customer_email: customer_email
            }]);
            if (error) {
                console.error('Error logging charge.refund.updated event:', error);
            } else {
                console.log('Logged charge.refund.updated event');
            }
            break;
        }
        case 'charge.dispute.created': {
            const dispute = event.data.object;
            const { error } = await supabaseServiceClient.from('stripe_disputes').insert([{
                event_type: 'charge.dispute.created',
                charge_id: dispute.charge,
                amount: dispute.amount,
                reason: dispute.reason,
                created_at: new Date(dispute.created * 1000).toISOString(),
                status: dispute.status,
                customer_email: customer_email
            }]);
            if (error) {
                console.error('Error logging charge.dispute.created event:', error);
            } else {
                console.log('Logged charge.dispute.created event');
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
}


async function isVelocityExceeded(customerId: any): Promise<boolean> {
    if (!customerId) return false;

    const maxTransactionsPerHour = 5; // Adjust the threshold as needed

    const oneHourAgo = Math.floor(Date.now() / 1000) - 3600;

    const transactions = await stripe.charges.list({
        customer: customerId,
        created: { gte: oneHourAgo }
    });

    return transactions.data.length > maxTransactionsPerHour;
}

