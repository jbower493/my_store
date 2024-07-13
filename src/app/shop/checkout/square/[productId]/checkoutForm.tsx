"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export function CheckoutForm() {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        if (!isScriptLoaded) {
            return;
        }

        // @ts-ignore
        if (!window.Square) {
            throw new Error("Square.js failed to load properly");
        }

        const appId = "sandbox-sq0idb-1vQJFTWfByZnQyU-Zrr0-A";
        const locationId = "LXP48XA597HDN";

        // @ts-ignore
        const payments = window.Square.payments(appId, locationId);
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
        <div>
            <Script
                src="https://sandbox.web.squarecdn.com/v1/square.js"
                onLoad={() => setIsScriptLoaded(true)}
            ></Script>
            {isScriptLoaded ? (
                <>
                    <form id="payment-form">
                        <div id="card-container"></div>
                        <button id="card-button" type="button">
                            Pay Now
                        </button>
                    </form>
                    <div id="payment-status-container"></div>
                </>
            ) : (
                <div>Loading ...</div>
            )}
        </div>
    );
}
