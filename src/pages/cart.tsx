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
    const [calcShip, setCalcShip] = useState(false)

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

    const calculateShipping = () => {
        setCalcShip(true)

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
                    <form className="flex flex-col" >
                        <h2 className="text-2xl"> Shipping </h2>
                        <div className="grid grid-cols-2">
                            <label htmlFor="fname">First name:</label>
                            <label htmlFor="lname">Last name:</label>
                            <input type='text' className="" placeholder='first name' />
                            <input type='text' className="" placeholder='last name' />
                        </div>
                        <label htmlFor="email">Email:</label><br />
                        <input type='email' className="" placeholder='email' />
                        <label htmlFor="address1">Address:</label><br />
                        <input type='text' className="" placeholder='address1' />
                        <input type='text' className="" placeholder='address2' />
                        <label htmlFor="city">City:</label><br />
                        <input type='text' className="" placeholder='city' />
                        <label htmlFor="state">State:</label><br />
                        <input type='text' className="" placeholder='state' />
                        <label htmlFor="zip">Zip:</label><br />
                        <input type='text' className="" placeholder='zip' />
                        <label htmlFor="country">Country:</label><br />
                        <select name='country' id="country">
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                        </select>
                        <button onClick={() => calculateShipping()} className="border border-white p-3 w-44 mx-auto mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer ">Calculate Shipping</button>
                    </form>

                    {calcShip && <form action="/api/checkout_sessions" method="POST">
                        {hasHydrated && 
                            <input type='hidden' name={`cart`} value={JSON.stringify(cart)} /> 
                        }
                        <section className="flex justify-center">
                            <button className="border border-white p-3 w-44 mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer " type="submit" role="link">
                                Checkout
                            </button>
                        </section>
                    </form>}
                </div>
            </div>
        </div>
    )
}