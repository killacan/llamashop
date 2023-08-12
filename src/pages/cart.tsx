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
        <>
            <h1> Cart </h1>
            <div>
                {hasHydrated && cart.map((item) => (
                    <div key={item.id} className="flex flex-row">
                        {item.images[0] && <Image src={item.images[0]?.src} alt="product image" width={300} height={300} />}
                        <div>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </div>
                        
                    </div>
                ))}
            </div>
            <button onClick={removeAllFromCart}>Remove All</button>
        </>
    )
}