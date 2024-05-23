// src/routes/api/stripe/prices/+server.ts

import { json, error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function GET({ url }) {
    const productId = url.searchParams.get('product_id');

    if (!productId) {
        throw error(400, 'Product ID is required');
    }

    try {
        // List prices for the product
        const prices = await stripe.prices.list({ product: productId });


        // Limit the information returned to interval and price
        const priceInfo = prices.data.map((price) => ({
            id: price.id,
            currency: price.currency,
            interval: price.recurring?.interval,
            amount: price.unit_amount ? (price.unit_amount / 100).toFixed(2) : null,
        }));

        return json({ prices: priceInfo });
    } catch (err) {
        console.error('Error fetching prices from Stripe:', err);
        throw error(500, 'Error fetching prices from Stripe');
    }
}