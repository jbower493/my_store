"use client";

import { products } from "@/backend/database/containers/billing/products";

import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const STRIPE_PUBLISHABLE_KEY =
    "pk_test_51H28whESQpqez14XaJQZyQrO1u9CQDOM3Ab2JPVgGiC3iFWVxjs44SD51IBz4I96a8yi57BQnyNiLsE8r3LT1tua002Pljtjr5";
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export default function Checkout({
    params,
}: {
    params: { productId: string };
}) {
    const [clientSecret, setClientSecret] = useState<string>("");

    const productInCart = products.find(
        (product) => product.id.toString() === params.productId
    );

    async function requestBackend() {
        const res = await fetch("http://localhost:3000/api/billing", {
            method: "POST",
            body: JSON.stringify({
                productId: productInCart?.id,
            }),
        });
        const data = (await res.json()) as { clientSecret: string };

        setClientSecret(data.clientSecret);
    }

    useEffect(() => {
        requestBackend();
    }, []);

    const options = {
        // passing the client secret obtained from the server
        clientSecret: clientSecret,
    };

    if (!clientSecret) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p>{productInCart?.name}</p>
            <p>${(productInCart?.price || 0) / 100}</p>

            <Elements stripe={stripePromise} options={options}>
                <PaymentElement className="my-7" />
                <button>Submit</button>
            </Elements>
        </div>
    );
}
