"use client";

import { products } from "@/backend/containers/billing/products";
import { CheckoutForm } from "./checkoutForm";

export default function Checkout({
    params,
}: {
    params: { productId: string };
}) {
    const productInCart = products.find(
        (product) => product.id.toString() === params.productId
    );

    return (
        <div>
            <h1 className="text-xl font-bold">Checkout</h1>
            <p>{productInCart?.name}</p>
            <p>${(productInCart?.price || 0) / 100}</p>
            <CheckoutForm productId={productInCart?.id || 0} />
        </div>
    );
}
