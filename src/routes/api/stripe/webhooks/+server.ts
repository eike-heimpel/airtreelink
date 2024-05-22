import { Netmask } from 'netmask';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "$env/static/private";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const post = async ({ request }) => {
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
        return {
            status: 400,
            body: 'Missing Stripe signature'
        };
    }

    let event: Stripe.Event;

    try {
        const body = await request.text();
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return {
            status: 400,
            body: 'Webhook signature verification failed'
        };
    }

    switch (event.type) {
        case 'charge.succeeded':
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;

            const email = paymentIntent.receipt_email;
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
                    await stripe.refunds.create({
                        payment_intent: paymentIntent.id
                    });

                    console.log(`Refunded suspicious payment intent: ${paymentIntent.id}`);
                } catch (err) {
                    console.error(`Failed to refund payment intent: ${paymentIntent.id}`, err);
                }
            }
            break;
        }
        case 'charge.refunded':
        case 'payment_intent.payment_failed': {
            // Handle refunds and failed payments if needed
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
};

// fraud-detection.ts in $lib directory

export function isSuspiciousEmail(email: string | null): boolean {
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

export function isSuspiciousIP(ipAddress: string | undefined): boolean {
    if (!ipAddress) return false;

    const suspiciousIPRanges = ['192.168.0.0/16', '10.0.0.0/8']; // Add more suspicious IP ranges as needed

    return suspiciousIPRanges.some(range => isIPInRange(ipAddress, range));
}

export function isHighRiskCountry(country: string | undefined): boolean {
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

export async function isVelocityExceeded(customerId: string | null): Promise<boolean> {
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