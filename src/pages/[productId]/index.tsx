import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
// import { QueryObserverSuccessResult } from "react-query"; // Make sure to import the correct type

export default function ProductPage() {
  const [showImage, setShowImage] = useState<number>(0);

  const router = useRouter();
  const productId = typeof router.query.productId === 'string' ? router.query.productId : undefined;

  const productQuery = api.shopRouter.getProduct.useQuery({ id: productId });

  const currentImg = productQuery.data?.images[showImage] as { src:string, position:string };
  
//   console.log(currentImg.src)

    const handleShowImage = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        const clickedImg = e.target as HTMLImageElement;
        const index = clickedImg.dataset.index;
        console.log(index)

        if (index) {
            setShowImage(parseInt(index));
        }

    }

  if ('data' in productQuery && productQuery.data) {
    return (
      <>
        <div className="flex flex-row">
          {productQuery.data.images && productQuery.data.images[showImage]?.src && (
            <div className="flex flex-row">
              <div className="overflow-y-scroll h-64 pr-3">
                {productQuery.data.images.map((image, index) => (
                  <Image onClick={(e) => handleShowImage (e)} src={image.src} width={50} height={50} alt="product image" key={index} data-index={index} />
                ))}
              </div>
              <Image
                className="h-64 w-64"
                src={currentImg.src}
                width={500}
                height={500}
                alt="product image"
              />
            </div>
          )}
          <h1 className="text-2xl">{productQuery.data.title}</h1>
        </div>
        {productQuery.error && (
          <div>
            <h1>This Product does not exist</h1>
          </div>
        )}
      </>
    );
  } else {
    // Return null or a loading state if productQuery is not yet ready
    return null;
  }
}