import { products } from "@/backend/database/containers/billing/products";
import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

export async function POST(request: NextRequest) {
    const requestBody = (await request.json()) as {
        confirmation_token_id: string;
        product_id: number;
    };
    const confirmationTokenId = requestBody.confirmation_token_id;
    const productId = requestBody.product_id;

    const product = products.find((product) => product.id === productId);

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            confirm: true,
            amount: product?.price || 0,
            currency: "aud",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            confirmation_token: confirmationTokenId,
        });

        return NextResponse.json({
            client_secret: paymentIntent.client_secret,
            status: paymentIntent.status,
        });
    } catch (e) {
        return NextResponse.json({ error: e });
    }
}
