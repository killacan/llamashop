
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ProductPage() {
    
    // const params = usePathname();
    // const productQuery = api.shopRouter.getProduct.useQuery({ id: params?.slice(1) });

    const router = useRouter();
    const productId = typeof router.query.productId === 'string' ? router.query.productId : undefined;

    const productQuery = api.shopRouter.getProduct.useQuery({ id: productId });
    console.log(productQuery.data?.title, "this is the product query")

    return (
        <>
            {productQuery.data && <div className="flex flex-row">
                
                {productQuery.data?.images[0] && 
                <div className="flex flex-row">
                    <div>
                        {productQuery.data?.images.map((image, index) => {
                            return (
                                <Image src={image.src} width={50} height={50} alt="product image" key={index} />
                            )
                        })}
                    </div>
                    <Image className="h-64 w-64" src={productQuery.data?.images[0].src} width={500} height={500} alt="product image" />
                </div>}
                <h1 className="text-2xl">{productQuery.data?.title}</h1>
            </div>}
            
            
            
            
            
            {productQuery.error && <div>
                <h1>This Product does not exist</h1>
            </div>}
        </>
    )
}