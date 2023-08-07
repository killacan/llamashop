import Link from "next/link"
import { type Product } from "./productInterface"
import Image from "next/image"

interface ProductListingProps {
    product:Product,
    key: number,
}

export default function ProductListing({product}: ProductListingProps ) {

    // console.log(product)

    return (
        <Link href={`/${product.id}`}>
            <div className="border border-white rounded-lg overflow-hidden">
                {product.images[0]?.src && <Image src={product.images[0].src} width={300} height={300} alt="image of the product" />}
                <p> {product.title}</p>
            </div>
        </Link>
    )
}