import { products } from "@/backend/database/containers/billing/products";
import { NextRequest, NextResponse } from "next/server";
console.log(process.env);
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

export async function POST(request: NextRequest) {
    const requestBody = (await request.json()) as { productId: number };
    const productId = requestBody.productId;
    const product = products.find((product) => product.id === productId);
    const priceInCents = product?.price || 0;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: priceInCents,
        currency: "aud",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
