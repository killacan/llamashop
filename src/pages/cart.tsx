import { type cartItem, useCartState } from "~/components/useCart"
import Image from 'next/image'
import { useEffect, useState } from "react";
import { makePrice } from "~/components/pricing";
import { TfiTrash } from 'react-icons/tfi';
import Link from "next/link";

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  
    useEffect(() => {
      setHasHydrated(true);
    }, []);
  
    return hasHydrated;
  };

export default function CartPage () {

    const [total, setTotal] = useState(0)

    const hasHydrated = useHasHydrated();
    const cart = useCartState((state) => state.cart)
    const cartFunctions = useCartState((state) => state)

    console.log(cart)



    const handleIncrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.target as HTMLButtonElement
        const posString = button.dataset.index as string
        const itemNum = parseInt(posString)
        cartFunctions.incrementQty(cart[itemNum])
    }

    const handleDecrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.target as HTMLButtonElement
        const posString = button.dataset.index as string
        const itemNum = parseInt(posString)
        cartFunctions.decrementQty(cart[itemNum])

        if (typeof cart[itemNum]?.qty === 'number') {
            const currentItem = cart[itemNum] as cartItem
            if (currentItem.qty <= 1) {
                cartFunctions.removeFromCart(currentItem)
            }

        }
    }

    useEffect(() => {
        let acc = 0
        cart.forEach(cartItem => {
            acc += cartItem.qty * makePrice(cartItem.variant.price)
        })
        setTotal(acc)
    }, [cart])

    const showImg = (item:cartItem) => {
        const currentVariantId = item.variant.id 
        const newShowImgArr = item.product.images.filter(img => {
            return img.variant_ids.includes(currentVariantId)   
        })
        if (newShowImgArr.length > 0 && newShowImgArr[0]) {
            return <Image src={newShowImgArr[0].src} alt="product image" width={200} height={200} />
            

        } else {
            if (item.product.images[0])
            return <Image src={item.product.images[0]?.src} alt="product image" width={200} height={200} />
        }
    }

    const buttonStyle = " border-black border p-2"

    return (
        <div className="flex lg:flex-row flex-col p-10 justify-center">
            <div className="flex flex-col">
                <h1 className="text-2xl pt-10 w-[480px]"> Cart </h1>
                <div className="divide-y divide-black">
                    {hasHydrated && cart.map((item, index) => (
                        <div key={index} className="flex flex-row justify-around">
                            {item.product.images[0] && showImg(item)}
                            <div>
                                <Link href={item.product.id}>{item.product.title}</Link>
                                <p>{item.variant.title}</p>
                                <p>Price: ${makePrice(item.variant.price)}</p>
                                <div className="flex ">
                                    <button className={`${buttonStyle}`} onClick={(e) => handleIncrement(e)} data-index={index}>+</button>
                                    <p className={`${buttonStyle}`}>Quantity: {item.qty}</p>
                                    <button className={`${buttonStyle}`} onClick={(e) => handleDecrement(e)} data-index={index}>-</button>
                                </div>
                                {/* <div dangerouslySetInnerHTML={{__html: item.product.description}}></div> */}
                            </div>
                            <button className={`${buttonStyle} h-8 rounded-full my-auto`} onClick={() => cartFunctions.removeFromCart(item)}><TfiTrash /></button>
                            
                        </div>
                    ))}
                    {hasHydrated && cart.length === 0 && <p>Cart is empty</p>}
                </div>
                
            </div>
            <div className="h-full lg:m-0 m-auto">
                <div className="flex flex-col border border-gray-500 p-10 m-5 sticky top-20 w-96">
                    <h2 className="text-2xl"> Summary </h2>
                    <p>Subtotal: ${total} </p>
                    <p>Total: (calculated at checkout)</p>

                    {/* <button className="border border-white p-3 w-44 mx-auto mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer ">Checkout</button> */}


                    <form action="/api/checkout_sessions" method="POST">
                        {hasHydrated && 
                            <input type='hidden' name={`cart`} value={JSON.stringify(cart)} /> 
                        }
                        <section className="flex justify-center">
                            <button className="border border-white p-3 w-44 mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer " type="submit" role="link">
                                Checkout
                            </button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    )
}