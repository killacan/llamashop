import { useCartState } from "~/components/useCart"


export default function CartPage () {

    const cart = useCartState((state) => state.cart)

    console.log(cart)

    return (
        <>
            <h1> Cart </h1>
        </>
    )
}