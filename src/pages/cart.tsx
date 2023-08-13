import { useCartState } from "~/components/useCart"
import Image from 'next/image'
import { useEffect, useState } from "react";

const useHasHydrated = () => {
    const [hasHydrated, setHasHydrated] = useState<boolean>(false);
  
    useEffect(() => {
      setHasHydrated(true);
    }, []);
  
    return hasHydrated;
  };

export default function CartPage () {

    const hasHydrated = useHasHydrated();
    const cart = useCartState((state) => state.cart)
    const removeAllFromCart = useCartState((state) => state.removeAllFromCart)

    console.log(cart)

    return (
        <div className="flex flex-row p-10 items-center justify-center">
            <div className="">
                <h1 className="text-2xl"> Cart </h1>
                <div>
                    {hasHydrated && cart.map((item) => (
                        <div key={item.product.id} className="flex flex-row">
                            {item.product.images[0] && <Image src={item.product.images[0]?.src} alt="product image" width={300} height={300} />}
                            <div>
                                <h2>{item.product.title}</h2>
                                <p>{item.product.description}</p>
                            </div>
                            
                        </div>
                    ))}
                </div>
                <button className="border border-white p-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer" onClick={removeAllFromCart}>Remove All</button>
            </div>
            <div className="">
                <h1 className="text-2xl"> Summary </h1>
            </div>
        </div>
    )
}