import { Button } from "@/components/Button";
import Image from "next/image";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
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
                        <p>${product.price}</p>
                        <Button sm>
                            <button>Add to cart</button>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
