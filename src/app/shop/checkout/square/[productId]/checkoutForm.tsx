"use client";

import { Button } from "@/components/Button";
import Script from "next/script";
import { useEffect, useState } from "react";

const SQUARE_SANDBOX_APPLICATION_ID = "sandbox-sq0idb-1vQJFTWfByZnQyU-Zrr0-A";
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

export function CheckoutForm({ productId }: { productId: number }) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
        let card;

        // @ts-ignore
        async function initializeCard(payments) {
            const card = await payments.card();
            await card.attach("#card-container");
            return card;
        }

        async function initCard() {
            try {
                // @ts-ignore
                card = await initializeCard(payments);
            } catch (e) {
                console.error("Initializing Card failed", e);
                return;
            }
        }

        initCard();

        // Call this function to send a payment token, buyer name, and other details
        // to the project server code so that a payment can be created with
        // Payments API
        // @ts-ignore
        async function createPayment(token) {
            const paymentResponse = await fetch(
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
            if (paymentResponse.ok) {
                return paymentResponse.json();
            }
            const errorBody = await paymentResponse.text();
            throw new Error(errorBody);
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

        // Helper method for displaying the Payment Status on the screen.
        // status is either SUCCESS or FAILURE;
        // @ts-ignore
        function displayPaymentResults(status) {
            const statusContainer = document.getElementById(
                "payment-status-container"
            );
            if (status === "SUCCESS") {
                // @ts-ignore
                statusContainer.classList.remove("is-failure");
                // @ts-ignore
                statusContainer.classList.add("is-success");
            } else {
                // @ts-ignore
                statusContainer.classList.remove("is-success");
                // @ts-ignore
                statusContainer.classList.add("is-failure");
            }

            // @ts-ignore
            statusContainer.style.visibility = "visible";
        }

        // @ts-ignore
        async function handlePaymentMethodSubmission(event, paymentMethod) {
            event.preventDefault();

            try {
                // disable the submit button as we await tokenization and make a
                // payment request.
                // @ts-ignore
                cardButton.disabled = true;
                // @ts-ignore
                const token = await tokenize(paymentMethod);
                // @ts-ignore
                const paymentResults = await createPayment(token);
                // @ts-ignore
                displayPaymentResults("SUCCESS");

                console.debug("Payment Success", paymentResults);
            } catch (e) {
                // @ts-ignore
                cardButton.disabled = false;
                // @ts-ignore
                displayPaymentResults("FAILURE");
                // @ts-ignore
                console.error(e.message);
            }
        }

        const cardButton = document.getElementById("card-button");
        // @ts-ignore
        cardButton.addEventListener("click", async function (event) {
            // @ts-ignore
            await handlePaymentMethodSubmission(event, card);
        });
    }, [isScriptLoaded]);

    return (
        <div className="mt-7">
            <Script
                src="https://sandbox.web.squarecdn.com/v1/square.js"
                onLoad={() => setIsScriptLoaded(true)}
            ></Script>
            {isScriptLoaded ? (
                <>
                    <form id="payment-form">
                        <div id="card-container"></div>
                        <Button>
                            <button id="card-button" type="button">
                                Pay Now
                            </button>
                        </Button>
                    </form>
                    <div id="payment-status-container"></div>
                </>
            ) : (
                <div>Loading ...</div>
            )}
        </div>
    );
}
