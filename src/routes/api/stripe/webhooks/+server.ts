import { Netmask } from 'netmask';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import Stripe from "stripe";
import { json, error } from '@sveltejs/kit';

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
                isSuspiciousEmail(email) ||
                isSuspiciousIP(ipAddress) ||
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

            if (
                isSuspiciousEmail(email) ||
                isSuspiciousIP(ipAddress) ||
                isHighRiskCountry(country) ||
                (await isVelocityExceeded(customerId))
            ) {
                try {
                    await stripe.refunds.create({
                        charge: charge.id
                    });

                    console.log(`Refunded suspicious charge: ${charge.id}`);
                } catch (err) {
                    if (err.type === 'StripeInvalidRequestError' && err.message.includes('No such charge')) {
                        console.error(`Failed to refund charge: ${charge.id}. Reason: ${err.message}`);
                    } else {
                        console.error(`Failed to refund charge for event ${event.type}: ${charge.id}`, err);
                    }
                }
            }
            break;
        }
        case 'charge.refunded': {
            const refund = event.data.object;
            await supabase.from('refund_logs').insert([{
                event_type: 'charge.refunded',
                charge_id: refund.id,
                amount: refund.amount,
                created_at: new Date(refund.created * 1000).toISOString(),
                status: refund.status,
                description: refund.description || null,
                customer_email: refund.receipt_email || customer_email
            }]);
            console.log('Logged charge.refunded event');
            break;
        }
        case 'charge.refund.updated': {
            const refund = event.data.object;
            await supabase.from('refund_logs').insert([{
                event_type: 'charge.refund.updated',
                charge_id: refund.id,
                amount: refund.amount,
                status: refund.status,
                created_at: new Date(refund.created * 1000).toISOString(),
                customer_email: customer_email
            }]);
            console.log('Logged charge.refund.updated event');
            break;
        }
        case 'charge.dispute.created': {
            const dispute = event.data.object;
            await supabase.from('stripe_disputes').insert([{
                event_type: 'charge.dispute.created',
                charge_id: dispute.charge,
                amount: dispute.amount,
                reason: dispute.reason,
                created_at: new Date(dispute.created * 1000).toISOString(),
                status: dispute.status,
                customer_email: customer_email
            }]);
            console.log('Logged charge.dispute.created event');
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
}

// fraud-detection.ts in $lib directory

function isSuspiciousEmail(email: string | null): boolean {
    if (!email) return false;

    const suspiciousDomains = [
        'example.com',
        'spam.com',
        'fakeemail.com',
        'disposable.com',
        'temporary-mail.com',
        'guerrillamail.com',
        'mailinator.com',
        'throwawaymail.com',
        'yopmail.com',
        'trashmail.com',
        'tempmail.org',
        'sharklasers.com',
        'grr.la',
        'guerrillamailblock.com',
        'spamgourmet.com',
        'anonymouse.org',
        'sendanonymousemail.com',
        'mytemp.email',
        '10minutemail.com',
        'temp-mail.org',
    ]; const emailDomain = email.split('@')[1];


    return suspiciousDomains.includes(emailDomain);
}

function isSuspiciousIP(ipAddress: string | undefined): boolean {
    if (!ipAddress) return false;

    const suspiciousIPRanges = ['192.168.0.0/16', '10.0.0.0/8']; // Add more suspicious IP ranges as needed

    return suspiciousIPRanges.some(range => isIPInRange(ipAddress, range));
}

function isHighRiskCountry(country: string | undefined): boolean {
    if (!country) return false;

    const highRiskCountries = [
        'RU', // Russia
        'CN', // China
        'VN', // Vietnam
        'ID', // Indonesia
        'PK', // Pakistan
        'NG', // Nigeria
        'IR', // Iran
        'IQ', // Iraq
        'VE', // Venezuela
        'EG', // Egypt
        'UA', // Ukraine
        'KE', // Kenya
        'PH', // Philippines
        'TR', // Turkey
    ];
    return highRiskCountries.includes(country);
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


function isIPInRange(ipAddress: string, range: string): boolean {
    const ip = new Netmask(ipAddress);
    const subnet = new Netmask(range);
    return subnet.contains(ip);
}