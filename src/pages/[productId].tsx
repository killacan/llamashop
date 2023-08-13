import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { cartItem, useCartState } from "~/components/useCart";
import { shopItemsState } from "~/components/shopItems";
import { Product } from '~/components/productInterface';

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

export default function ProductPage() {
  const [showImage, setShowImage] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Array<number>>([]);
  const hasHydrated = useHasHydrated();

  const cart = useCartState((state) => (state.cart))
  const cartFunctions = useCartState(state => state)
  const shopItems = shopItemsState((state) => state.shopItems);

  const router = useRouter();
  let productId = typeof router.query.productId === 'string' ? router.query.productId : undefined;

  let productQueryData: Product | null | undefined = null;

  if (hasHydrated) {
    const existingProduct = shopItems.find(product => product.id === productId);
    if (existingProduct) {
      productQueryData = existingProduct;
      productId = undefined;
    } 
  } else {
    productId = undefined;
  }

  const productQuery = api.shopRouter.getProduct.useQuery({ id: productId });

  if (!productQueryData) {
    productQueryData = productQuery.data;
  }

  const currentImg = productQueryData?.images[showImage] as { src: string, position: string };

  const productOptions = productQueryData?.options;


  if (productQueryData && selectedOptions.length === 0) {
    productQueryData.variants.forEach((variant) => {
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
    if (productQueryData) {
      const cartItemProduct = productQueryData;
      const cartItemVariant = cartItemProduct.variants.find((variant) => {
        return variant.options.every((option, index) => {
          return option === selectedOptions[index];
        });
      });

      if (typeof cartItemVariant === 'undefined') {
        console.log('no variant selected, error adding to cart');
        return;
      }
      
      const cartItem: cartItem = {
        product: cartItemProduct,
        variant: cartItemVariant as { id: number, cost: number, is_available: boolean, is_default: boolean, options: Array<number>, title: string},
        qty: 1,
      }

      const cartIndex = cart.findIndex(item => item.product.id === cartItem.product.id && 
        item.variant.id === cartItem.variant.id);

      if (cartIndex === -1) {
        cartFunctions.addToCart(cartItem);
      } else {
        const existingCartItem = cart[cartIndex]
        cartFunctions.incrementQty(existingCartItem)
      }


    }
    // console.log('add to cart', productQueryData)
  }

  if (productQueryData) {
    return (
      <div className="">
        <div className="flex flex-row justify-center p-10">
          {hasHydrated && productQueryData.images && productQueryData.images[showImage]?.src && (
            <div className="flex flex-row">
              <div className="overflow-y-scroll h-64 pr-3 sticky top-20">
                {productQueryData.images.map((image, index) => (
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
            <h1 className="text-2xl lg:m-12">{productQueryData.title}</h1>
            {hasHydrated && productOptions && optionsBuilder()}
            <div className="text-lg lg:m-12 w-96" dangerouslySetInnerHTML={{__html: productQueryData.description}}></div>
          
            <button className="text-white w-3/4 h-10 mx-auto bg-violet-700 rounded-full hover:bg-violet-500" onClick={(e) => handleAddToCart (e)}>
              Add to Cart
            </button>
          </form>

        </div>
      </div>
    );
  } else {
    // Return null or a loading state if productQuery is not yet ready
    return <h2>No Product or Loading</h2>;
  }
}