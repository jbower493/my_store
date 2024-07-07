import { Product, ProductCard } from "./productCard";

const products: Product[] = [
    {
        id: 1,
        name: "Grey Asics",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: "67.99",
        imageUrl: "/grey_asics.jpg",
    },
    {
        id: 2,
        name: "Green NB",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: "89.99",
        imageUrl: "/green_nb.jpg",
    },
    {
        id: 3,
        name: "Blue Addidas",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: "43.99",
        imageUrl: "/blue_addidas.jpg",
    },
];

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
