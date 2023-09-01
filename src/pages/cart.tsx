import { type cartItem, useCartState } from "~/components/useCart"
import Image from 'next/image'
import { useEffect, useState } from "react";
import { makePrice, makeShippingCost, makeStripePrice, makeStripeShippingCost } from "~/components/pricing";
import { TfiTrash } from 'react-icons/tfi';
import Link from "next/link";
import { api } from "~/utils/api";

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
    const [address_to, setaddress_to] = useState({
        address1: '',
        address2: '',
        city: '',
        country: 'US',
        email: '',
        first_name: '',
        last_name: '',
        region: '',
        zip: '',
    })
    const [shippingCost, setShippingCost] = useState(0)
    const [pingShipping, setPingShipping] = useState(false)

    const hasHydrated = useHasHydrated();
    const cart = useCartState((state) => state.cart)
    const cartFunctions = useCartState((state) => state)

    const line_items = cart.map((item: cartItem) => ({
        product_id: item.product.id,
        variant_id: item.variant.id,
        quantity: item.qty,
    }))

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

    const shipCostResponse = api.shopRouter.getShippingCost.useQuery({order: {address_to, line_items: line_items}},
        {
            enabled: pingShipping && line_items.length > 0,
            onSuccess: (data) => {
                if (data) {
                    setShippingCost(data.standard)
                    setPingShipping(false)
                    // console.log(data, "this is some data")
                } 
            }
        }
    )

    const calculateShipping = (e ?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e)
            e.preventDefault()
        // if (shippingCost > 0) {
            setCalcShip(true)
        // }
        setPingShipping(true)        
        // console.log(shipCostResponse)
        // console.log(cart.length, "cart length")
        if (cart.length === 0) {
            setShippingCost(0)
        }
        // console.log(shippingCost, "shipping cost")
        


    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        // console.log(e.target.value)

        setaddress_to({
            ...address_to,
            [e.target.name]: e.target.value
        })
        // console.log(address_to)
        // console.log(JSON.stringify(address_to).length)
    }

    useEffect(() => {
        let acc = 0
        cart.forEach(cartItem => {
            acc += cartItem.qty * makePrice(cartItem.variant.price)
        })
        setTotal(acc)
        // setCalcShip(false)
        calculateShipping()
    }, [cart])

    useEffect(() => {
        calculateShipping()
    }, [address_to])

    useEffect(() => {
        calculateShipping()
    }, [])



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


                    {/* <button className="border border-white p-3 w-44 mx-auto mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer ">Checkout</button> */}
                    <form className="flex flex-col" >
                        <h2 className="text-xl"> Shipping Country</h2>
                        {/* <div className="grid grid-cols-2">
                            <label htmlFor="first_name">First name:</label>
                            <label htmlFor="last_name">Last name:</label>
                            <input name="first_name" type='text' className="" placeholder='first name' onChange={(e) => handleInputChange(e)} />
                            <input name="last_name" type='text' className="" placeholder='last name' onChange={(e) => handleInputChange(e)}/>
                        </div>
                        <label htmlFor="email">Email:</label><br />
                        <input name="email" type='email' className="" placeholder='email' onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="address1">Address:</label><br />
                        <input name="address1" type='text' className="" placeholder='address1' onChange={(e) => handleInputChange(e)}/>
                        <input name="address2" type='text' className="" placeholder='address2' onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="city">City:</label><br />
                        <input name="city" type='text' className="" placeholder='city' onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="region">State:</label><br />
                        <input name="region" type='text' className="" placeholder='state' onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="zip">Zip:</label><br />
                        <input name="zip" type='text' className="" placeholder='zip' onChange={(e) => handleInputChange(e)}/>
                        <label htmlFor="country">Country:</label><br /> */}
                        <select name='country' id="country" onChange={(e) => handleInputChange(e)}>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            {/* <option value="UK">United Kingdom</option> */}
                        </select>
                        {!!!calcShip && <button onClick={(e) => calculateShipping(e)} className="border border-white p-3 w-44 mx-auto mt-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer ">Calculate Shipping</button>}
                    </form>
                    <p>Shipping: ${makeShippingCost(shippingCost)}</p>
                    <p>Subtotal: ${total + makeShippingCost(shippingCost)} </p>
                    <p>Total: (calculated at checkout)</p>
                    {calcShip && hasHydrated && cart.length > 0 && <form action="/api/checkout_sessions" method="POST">
                        
                        <>
                            <input type='hidden' name={`cart`} value={JSON.stringify(cart)} /> 
                            <input type="hidden" name="address_to" value={JSON.stringify(address_to)} />
                            <input type='hidden' name="shippingCost" value={makeStripeShippingCost(shippingCost)} />
                        </>
                        
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