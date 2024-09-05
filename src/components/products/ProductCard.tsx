// src/components/products/ProductCard.tsx
import type { ProductWithImages } from "@/interfaces";
import { useState } from "react";

interface Props {
    product: ProductWithImages;
}

export const ProductCard = ({ product }: Props) => {

    const images = product.images.split(',').map(img => {
        return img.startsWith('http')
            ? img
            : `${import.meta.env.PUBLIC_URL}/images/products/${img}`;
    });

    const [currentImage, setCurrentImage] = useState(images[0]);

    return (
        <a href={`/products/${product.slug}`} className="block">
            <div className="rounded-md overflow-hidden shadow-md hover:shadow-lg border flex flex-col h-full">
                <div className="relative flex-1">
                    <img
                        src={currentImage}
                        alt={product.title}
                        className="h-[350px] w-full object-cover rounded-t-lg"
                        onMouseEnter={() => setCurrentImage(images[1] ?? images[0])}
                        onMouseLeave={() => setCurrentImage(images[0])}
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-medium">{product.title}</h4>
                    <p className="text-xl font-medium mb-2">${product.price}</p>
                    <button className="mt-auto bg-[#d5d6c3] hover:bg-[#231f20] text-black hover:text-[#d5d6c3] font-bold py-2 px-4 rounded-lg border transition duration-200 ease-in-out w-full">
                        Ver Producto !
                    </button>
                </div>
            </div>
        </a>
    );
};
