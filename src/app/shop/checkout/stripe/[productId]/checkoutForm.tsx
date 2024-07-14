"use client";

import { Button } from "@/components/Button";
import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";

export function CheckoutForm({ productId }: { productId: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmPaymentStatus, setConfirmPaymentStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    async function fetchCreateConfirmIntent(confirmationTokenId: string) {
        try {
            const res = await fetch(
                "http://localhost:3000/api/billing/stripe/create-confirm-intent",
                {
                    method: "POST",
                    body: JSON.stringify({
                        confirmation_token_id: confirmationTokenId,
                        product_id: productId,
                    }),
                }
            );

            type CreateConfirmIntent =
                | {
                      client_secret: string;
                      status: string;
                  }
                | {
                      error: unknown;
                  };

            const data: CreateConfirmIntent = await res.json();

            return data;
        } catch (e) {
            return {
                error: "Fetch failed.",
            };
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsSubmitting(true);

        const { error: submitError } = await elements?.submit();

        if (submitError) {
            setIsSubmitting(false);
            setErrorMessage(submitError.message || "");
        }

        const { error, confirmationToken } =
            await stripe.createConfirmationToken({
                elements,
            });

        if (error) {
            setIsSubmitting(false);
            setErrorMessage(error.message || "");
        }

        // Hit "confirm payment" endpoint
        const data = await fetchCreateConfirmIntent(
            confirmationToken?.id || ""
        );

        setIsSubmitting(false);
        setConfirmPaymentStatus("success");
        console.log(data);
    }

    if (confirmPaymentStatus === "error") {
        return <div className="mt-5">{errorMessage}</div>;
    }

    if (confirmPaymentStatus === "success") {
        return <div className="mt-5">Payment successful</div>;
    }

    return (
        <form id="paymentForm" onSubmit={handleSubmit}>
            <PaymentElement className="my-7" id="payment-element" />
            <Button>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Pay Now"}
                </button>
            </Button>
        </form>
    );
}
