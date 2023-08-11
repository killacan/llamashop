import { useCartState } from "~/components/useCart"

export default function CartPage () {

    const cart = useCartState((state) => state.cart)
    const removeAllFromCart = useCartState((state) => state.removeAllFromCart)

    console.log(cart)

    return (
        <>
            <h1> Cart </h1>
            <button onClick={removeAllFromCart}>Remove All</button>
        </>
    )
}