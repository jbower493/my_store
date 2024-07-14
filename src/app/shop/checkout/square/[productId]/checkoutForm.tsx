"use client";

import { Button } from "@/components/Button";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const SQUARE_SANDBOX_APPLICATION_ID = "sandbox-sq0idb-1vQJFTWfByZnQyU-Zrr0-A";
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

export function CheckoutForm({ productId }: { productId: number }) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [confirmPaymentStatus, setConfirmPaymentStatus] = useState<
        "idle" | "success" | "error"
    >("idle");

    // @ts-ignore
    const card = useRef(null);

    useEffect(() => {
        if (!isScriptLoaded) {
            return;
        }

        // @ts-ignore
        if (!window.Square) {
            throw new Error("Square.js failed to load properly");
        }

        // @ts-ignore
        const payments = window.Square.payments(
            SQUARE_SANDBOX_APPLICATION_ID,
            SQUARE_LOCATION_ID
        );

        // @ts-ignore
        async function initializeCard(payments) {
            const card = await payments.card();
            await card.attach("#card-container");
            return card;
        }

        async function initCard() {
            try {
                // @ts-ignore
                card.current = await initializeCard(payments);
            } catch (e) {
                console.error("Initializing Card failed", e);
                return;
            }
        }

        initCard();
    }, [isScriptLoaded]);

    // Call this function to send a payment token, buyer name, and other details
    // to the project server code so that a payment can be created with
    // Payments API
    // @ts-ignore
    async function fetchCreatePayment(token) {
        try {
            const res = await fetch(
                "http://localhost:3000/api/billing/square/payment",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        source_id: token,
                        idempotency_key: window.crypto.randomUUID(),
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

    // This function tokenizes a payment method.
    // The ‘error’ thrown from this async function denotes a failed tokenization,
    // which is due to buyer error (such as an expired card). It's up to the
    // developer to handle the error and provide the buyer the chance to fix
    // their mistakes.
    // @ts-ignore
    async function tokenize(paymentMethod) {
        const tokenResult = await paymentMethod.tokenize();
        if (tokenResult.status === "OK") {
            return tokenResult.token;
        } else {
            let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
            if (tokenResult.errors) {
                errorMessage += ` and errors: ${JSON.stringify(
                    tokenResult.errors
                )}`;
            }
            throw new Error(errorMessage);
        }
    }

    // @ts-ignore
    async function handlePaymentMethodSubmission(e, paymentMethod) {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // @ts-ignore
            const token = await tokenize(paymentMethod);
            // @ts-ignore
            await fetchCreatePayment(token);

            setIsSubmitting(false);
            setConfirmPaymentStatus("success");
        } catch (e) {
            // @ts-ignore
            setErrorMessage(e);
            setConfirmPaymentStatus("error");
        }
    }

    if (confirmPaymentStatus === "error") {
        return <div className="mt-5">{errorMessage}</div>;
    }

    if (confirmPaymentStatus === "success") {
        return <div className="mt-5">Payment successful</div>;
    }

    return (
        <div className="mt-7">
            <Script
                src="https://sandbox.web.squarecdn.com/v1/square.js"
                onLoad={() => setIsScriptLoaded(true)}
            ></Script>
            {isScriptLoaded ? (
                <>
                    <form
                        onSubmit={(e) =>
                            handlePaymentMethodSubmission(e, card.current)
                        }
                    >
                        <div id="card-container"></div>
                        <Button>
                            <button type="submit">
                                {isSubmitting ? "Processing..." : "Pay Now"}
                            </button>
                        </Button>
                    </form>
                </>
            ) : (
                <div>Loading ...</div>
            )}
        </div>
    );
}
