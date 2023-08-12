import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { useCartState } from "~/components/useCart";

export default function ProductPage() {
  const [showImage, setShowImage] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Array<number>>([]);

  const cart = useCartState((state) => state.cart)
  const addToCart = useCartState((state) => state.addToCart)

  const router = useRouter();
  const productId = typeof router.query.productId === 'string' ? router.query.productId : undefined;

  const productQuery = api.shopRouter.getProduct.useQuery({ id: productId });

  const currentImg = productQuery.data?.images[showImage] as { src:string, position:string };
  
  const productOptions = productQuery.data?.options

  if (productQuery.data && selectedOptions.length === 0) {
    productQuery.data.variants.forEach((variant) => {
      if (variant.is_default) {
        setSelectedOptions(variant.options);
      }
    });
  }

  const optionsBuilder = () => {
    if (productOptions) {
      return productOptions.map((option, rootIndex) => (
        <div key={rootIndex}>
          <h2>{option.name}</h2>
          <p>{option.type}:</p>
          <div className="grid grid-cols-4 gap-2">
            {option.values.map((value, index) => (
              <label className="border border-black rounded-sm flex items-center justify-center" key={index}>
                <input
                  type="radio"
                  name={`option-${rootIndex}`}
                  value={value.id}
                  onChange={() => handleOptionChange(rootIndex, value.id)}
                />
                {value.title}
              </label>
            ))}
          </div>
        </div>
      ));
    }
  };
  
  const handleOptionChange = (rootIndex:number, selectedValue:number) => {
    // Implement your logic to update the selected option for the specific index
    console.log(`Option ${rootIndex} selected: ${selectedValue}`);
    setSelectedOptions((prev) => {
      const newOptions = [...prev];
      newOptions[rootIndex] = selectedValue;
      console.log(newOptions, 'newOptions')
      return newOptions;
    }
    );
    console.log(selectedOptions, 'selectedOptions')
  };

  const handleShowImage = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const clickedImg = e.target as HTMLImageElement;
    const index = clickedImg.dataset.index;

    if (index) {
      setShowImage(parseInt(index));
    }

  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (productQuery.data) {
      const cartItem = productQuery.data;
      
      addToCart(cartItem);
    }
    console.log('add to cart', productQuery.data)
    console.log('cart', cart)
  }

  if ('data' in productQuery && productQuery.data) {
    return (
      <div className="">
        <div className="flex flex-row justify-center p-10">
          {productQuery.data.images && productQuery.data.images[showImage]?.src && (
            <div className="flex flex-row">
              <div className="overflow-y-scroll h-64 pr-3 sticky top-20">
                {productQuery.data.images.map((image, index) => (
                  <Image onClick={(e) => handleShowImage (e)} src={image.src} width={50} height={50} alt="product image" key={index} data-index={index} />
                ))}
              </div>
              <Image
                className="h-64 w-64 sticky top-20"
                src={currentImg.src}
                width={500}
                height={500}
                alt="product image"
              />
            </div>
          )}
          <form className="flex flex-col">
            <h1 className="text-2xl lg:m-12">{productQuery.data.title}</h1>
            {productOptions && optionsBuilder()}
            <div className="text-lg lg:m-12 w-96" dangerouslySetInnerHTML={{__html: productQuery.data.description}}></div>
          
            <button className="text-white w-3/4 h-10 mx-auto bg-violet-700 rounded-full hover:bg-violet-500" onClick={(e) => handleAddToCart (e)}>
              Add to Cart
            </button>
          </form>

        </div>
        
        
        
        {productQuery.error && (
          <div>
            <h1>This Product does not exist</h1>
          </div>
        )}
      </div>
    );
  } else {
    // Return null or a loading state if productQuery is not yet ready
    return null;
  }
}