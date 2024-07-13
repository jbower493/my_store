"use client";

import { products } from "@/backend/database/containers/billing/products";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { CheckoutForm } from "./checkoutForm";

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
    const productInCart = products.find(
        (product) => product.id.toString() === params.productId
    );

    const options: StripeElementsOptions = {
        mode: "payment",
        amount: productInCart?.price,
        currency: "aud",
        paymentMethodCreation: "manual",
    };

    return (
        <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p>{productInCart?.name}</p>
            <p>${(productInCart?.price || 0) / 100}</p>
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm productId={productInCart?.id || 0} />
            </Elements>
        </div>
    );
}
