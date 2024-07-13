"use client";

import { Button } from "@/components/Button";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useEffect, useState } from "react";

export function CheckoutForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const stripe = useStripe();
    const elements = useElements();

    const searchParams = new URLSearchParams(window.location.search);
    const clientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/shop/checkout/1",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsSubmitting(false);
    }

    useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded.");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage(
                        "Your payment was not successful, please try again."
                    );
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    if (redirectStatus) {
        return (
            <div className="mt-5" id="payment-message">
                {message}
            </div>
        );
    }

    return (
        <form id="paymentForm" onSubmit={handleSubmit}>
            <PaymentElement className="my-7" id="payment-element" />
            <Button>
                <button disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Pay Now"}
                </button>
            </Button>
        </form>
    );
}
