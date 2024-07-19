export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

export const products: Product[] = [
    {
        id: 1,
        name: "Grey Asics",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: 6799,
        imageUrl: "/grey_asics.jpg",
    },
    {
        id: 2,
        name: "Green NB",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: 8999,
        imageUrl: "/green_nb.jpg",
    },
    {
        id: 3,
        name: "Blue Addidas",
        description:
            "A thing or two about the trainers before you buy them. You should read this part",
        price: 4399,
        imageUrl: "/blue_addidas.jpg",
    },
];
