import Link from "next/link"
import { type Product } from "./productInterface"
import Image from "next/image"
import { makePrice } from "./pricing"

interface ProductListingProps {
    product:Product,
    key: number,
}

export default function ProductListing({product}: ProductListingProps ) {

    return (
        <Link href={`/${product.id}`} >
            <div className="border border-white rounded-lg overflow-hidden duration-300 hover:scale-110">
                {product.images[0]?.src && <Image src={product.images[0].src} width={300} height={300} alt="image of the product" />}
                <p> {product.title}</p>
                <p> ${makePrice(product.variants[0].price)}</p>
            </div>
        </Link>
    )
}