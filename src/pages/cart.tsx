import { cartItem, useCartState } from "~/components/useCart"
import Image from 'next/image'
import { useEffect, useState } from "react";
import { Product } from "~/components/productInterface";

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
        const itemNum = parseInt(posString) as number
        cartFunctions.incrementQty(cart[itemNum])
    }

    const handleDecrement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const button = e.target as HTMLButtonElement
        const posString = button.dataset.index as string
        const itemNum = parseInt(posString) as number
        cartFunctions.decrementQty(cart[itemNum])

        if (typeof cart[itemNum]?.qty === 'number') {
            let currentItem = cart[itemNum] as cartItem
            if (currentItem.qty <= 1) {
                cartFunctions.removeFromCart(currentItem)
            }

        }
    }

    useEffect(() => {
        let acc = 0
        cart.forEach(cartItem => {
            acc += cartItem.qty * cartItem.variant.cost
        })
        setTotal(acc / 100)
    }, [cart])

    return (
        <div className="flex flex-row p-10 items-center justify-center">
            <div className="">
                <h1 className="text-2xl pl-10"> Cart </h1>
                <div className="divide-y divide-black">
                    {hasHydrated && cart.map((item, index) => (
                        <div key={index} className="flex flex-row">
                            {item.product.images[0] && <Image src={item.product.images[0]?.src} alt="product image" width={200} height={200} />}
                            <div>
                                <h2>{item.product.title}</h2>
                                <p>{item.variant.title}</p>
                                <div className="flex ">
                                    <button onClick={(e) => handleIncrement(e)} data-index={index}>+</button>
                                    <p>Quantity: {item.qty}</p>
                                    <button onClick={(e) => handleDecrement(e)} data-index={index}>-</button>
                                </div>
                                {/* <div dangerouslySetInnerHTML={{__html: item.product.description}}></div> */}
                            </div>
                            
                        </div>
                    ))}
                </div>
                <button className="border border-white p-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer" onClick={cartFunctions.removeAllFromCart}>Remove All</button>
            </div>
            <div className="h-full">
                <div className="flex flex-col border border-gray-500 p-10 m-5 sticky top-20">
                    <h2 className="text-2xl"> Summary </h2>
                    <p>Subtotal: ${total} </p>
                    <p>Total: (calculated at checkout)</p>

                    <button className="border border-white p-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer">Checkout</button>
                </div>
            </div>
        </div>
    )
}