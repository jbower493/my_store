import { products } from "@/backend/containers/billing/products";
import { NextRequest, NextResponse } from "next/server";
import { Client, Environment } from "square";

const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

const client = new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,
});

export async function POST(request: NextRequest) {
    const requestBody = (await request.json()) as {
        product_id: number;
        idempotency_key: string;
        source_id: string;
    };

    const sourceId = requestBody.source_id;
    const idempotencyKey = requestBody.idempotency_key;
    const productId = requestBody.product_id;
    const product = products.find((product) => product.id === productId);

    try {
        const response = await client.paymentsApi.createPayment({
            sourceId,
            idempotencyKey,
            amountMoney: {
                // @ts-ignore
                amount: product.price,
                currency: "AUD",
            },
            autocomplete: true,
            locationId: SQUARE_LOCATION_ID,
        });

        return NextResponse.json({
            status: response.result.payment?.status,
        });
    } catch (e) {
        return NextResponse.json({ error: e });
    }
}
