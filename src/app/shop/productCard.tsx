import { Product } from "@/backend/database/containers/billing/products";
import { Button } from "@/components/Button";
import Image from "next/image";
import Link from "next/link";

function getPriceInDollars(priceInCents: number) {
    return (priceInCents / 100).toFixed(2);
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="w-[250px]">
            <div className="relative w-full h-[170px]">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    objectFit="cover"
                />
            </div>

            <div className="mt-3">
                <div>
                    <h3>{product.name}</h3>
                    <p className="text-gray-500 text-sm">
                        {product.description}
                    </p>
                    <div className="mt-3 flex justify-between items-end">
                        <p>${getPriceInDollars(product.price)}</p>
                        <Button sm>
                            <Link href={`/shop/checkout/${product.id}`}>
                                Add to cart
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
