import React, { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { type cartItem, useCartState } from "~/components/useCart";
import { shopItemsState } from "~/components/shopItems";
import { type Product } from '~/components/productInterface';
import { makePrice } from '~/components/pricing';
import { useHasHydrated } from '.';

interface img {
  src: string,
  position: string,
}

export default function ProductPage() {
  const [showImage, setShowImage] = useState<number>(0);
  const [selectedOptions, setSelectedOptions] = useState<Array<number>>([]);
  const [imgArr, setImgArr] = useState<Array<img>>([]);
  const [varPrice, setVarPrice] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
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

  let currentImg = productQueryData?.images[0] as { src: string, position: string };

  if (imgArr[showImage]) {
    currentImg = imgArr[showImage] as { src: string, position: string };
  } else {
    currentImg = productQueryData?.images[0] as { src: string, position: string };
  }

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
        <div className='pb-5' key={rootIndex}>
          <p>{option.type}:</p>
          <div className="grid grid-cols-4 gap-2">
            {option.values.map((value, index) => {
              if (selectedOptions[rootIndex] === value.id) {
                return <label className="border border-black cursor-pointer rounded-sm flex items-center justify-center bg-gray-300" key={index}>
                  <input
                    className='hidden'
                    type="radio"
                    name={`option-${rootIndex}`}
                    value={value.id}
                    checked={selectedOptions[rootIndex] === value.id}
                    onChange={() => handleOptionChange(rootIndex, value.id)}
                  />
                  {value.title}
                </label>

              } else {
                return <label className="border border-black cursor-pointer rounded-sm flex items-center justify-center" key={index}>
                  <input
                    className='hidden'
                    type="radio"
                    name={`option-${rootIndex}`}
                    value={value.id}
                    checked={selectedOptions[rootIndex] === value.id}
                    onChange={() => handleOptionChange(rootIndex, value.id)}
                  />
                  {value.title}
                </label>
              }
            })}
          </div>
        </div>
      ));
    }
  };
  
  const handleOptionChange = (rootIndex:number, selectedValue:number) => {
    // Implement your logic to update the selected option for the specific index
    setSelectedOptions((prev) => {
      const newOptions = [...prev];
      newOptions[rootIndex] = selectedValue;
      // console.log(newOptions, 'newOptions')
      return newOptions;
    }
    );
    // console.log(selectedOptions, 'selectedOptions')
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

    setIsAddingToCart(true);

    if (productQueryData) {
      const cartItemProduct = productQueryData;
      const cartItemVariant = cartItemProduct.variants.find((variant) => {
        return variant.options.every((option, index) => {
          return option === selectedOptions[index];
        });
      });

      if (typeof cartItemVariant === 'undefined') {
        console.log('no variant selected, error adding to cart');
        setIsAvailable(false);
        setTimeout(() => {
          setIsAddingToCart(false);
          setIsAvailable(true);
        }, 500)
        return;
      }
      
      const cartItem: cartItem = {
        product: cartItemProduct,
        variant: cartItemVariant as { id: number, cost: number, is_available: boolean, is_default: boolean, options: Array<number>, title: string, price: number},
        qty: 1,
      }

      const cartIndex = cart.findIndex(item => item.product.id === cartItem.product.id && 
        item.variant.id === cartItem.variant.id);

      if (cartItemVariant.is_available) {
        if (cartIndex === -1) {
          cartFunctions.addToCart(cartItem);
        } else {
          const existingCartItem = cart[cartIndex]
          cartFunctions.incrementQty(existingCartItem)
        }
  
        setTimeout(() => {
          setIsAddingToCart(false);
        }, 500)

      } else {
        console.log('item not available')
        setIsAvailable(false);
        setTimeout(() => {
          setIsAvailable(true);
          setIsAddingToCart(false);
        }, 1000)
      }

    }
  }

  useEffect(() => {
    // find the variant that matches the selected options
    // filter the images to only show the ones that match the variant.id of the selected variant

    if (productQueryData) {
      const variant = productQueryData.variants.find((variant) => {
        return variant.options.every((option, index) => {
          return option === selectedOptions[index];
        });
      }
      );
      if (variant) {
        // console.log(variant, 'variant')
        const variantId = variant.id;
        const newImgArr = productQueryData.images.filter(img => img.variant_ids.includes(variantId))
        if (newImgArr.length > 0) {
          setImgArr(newImgArr);
        }
        setVarPrice(makePrice(variant.price));
        // console.log(varPrice, 'varPrice')
        // console.log(newImgArr, 'imgArr')
      }
    }
  }, [selectedOptions, productQueryData])

  if (productQueryData) {

    return (
      <div className="">
        <div className="flex lg:flex-row flex-col justify-center sm:p-10">
          {hasHydrated && productQueryData.images && productQueryData.images[showImage]?.src && (
            <div className="flex flex-row lg:pr-10 justify-center">
              <div className="overflow-y-scroll h-96 w-16 pr-3 sticky top-20">
                {imgArr.length > 0 && imgArr
                .map((image, index) => (
                  <Image className='cursor-pointer w-full' onClick={(e) => handleShowImage (e)} src={image.src} width={50} height={50} alt="product image" key={index} data-index={index} />
                ))}
                {imgArr.length === 0 && productQueryData.images
                .map((image, index) => (
                  <Image className='cursor-pointer w-full' onClick={(e) => handleShowImage (e)} src={image.src} width={50} height={50} alt="product image" key={index} data-index={index} />
                ))}
              </div>
              <Image
                className="h-96 w-96 sticky top-20"
                src={currentImg.src}
                width={1000}
                height={1000}
                alt="product image"
              />
            </div>
          )}
          <form className="flex flex-col">
            <h1 className="text-2xl lg:mb-10">{productQueryData.title}</h1>
            <p className="text-lg my-3">${varPrice}</p>
            {hasHydrated && productOptions && optionsBuilder()}
            <div className="text-lg lg:mb-12 w-96" dangerouslySetInnerHTML={{__html: productQueryData.description}}></div>
          
            {isAvailable ? <button 
              className="text-white w-3/4 h-10 mx-auto bg-violet-700 rounded-full hover:bg-violet-500" 
              onClick={(e) => handleAddToCart (e)}
              disabled={isAddingToCart}
            >
              {(isAddingToCart ? 'Adding...' : 'Add to Cart')}
            </button> :
            <button
              className="text-white w-3/4 h-10 mx-auto bg-red-700 rounded-full hover:bg-red-500"
              onClick={(e) => handleAddToCart (e)}
              disabled={isAddingToCart}
            >
              {('Not Available')}
            </button>
            }
          </form>

        </div>
      </div>
    );
  } else {
    // Return null or a loading state if productQuery is not yet ready
    return <h2>No Product or Loading</h2>;
  }
}