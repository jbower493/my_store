import { ProductCard } from "./productCard";
import { products } from "@/backend/database/containers/billing/products";

export default function Shop() {
    return (
        <div>
            <div className="flex gap-8">
                {products.map((product) => {
                    return <ProductCard key={product.id} product={product} />;
                })}
            </div>
        </div>
    );
}
