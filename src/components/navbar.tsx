// import { SignInButton, SignOutButton } from "@clerk/nextjs";
// import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { TiShoppingCart } from "react-icons/ti";
import { useCartState } from "./useCart";
import { useHasHydrated } from "~/pages";

export default function Navbar () {

    const hasHydrated = useHasHydrated();

    // const user = useUser();
    const cart = useCartState(state => state.cart);

    const signButtonTailwind = "border border-white p-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer";

    let acc = 0
    const indicatorNum = cart.forEach(item => {
        acc += item.qty
    })
    return (

        <nav className="flex items-center content-center justify-between flex-wrap bg-violet-700 p-6 w-full sticky top-0 z-10">
            <div className="flex flex-shrink-0 text-white mr-6">
                <Link href={"/"} ><span className="font-semibold text-xl tracking-tight p-5 group hover:scale-110 duration-300">Leisure <span className="group-hover:text-[hsl(280,100%,70%)] group hover:scale-110 duration-300">Llama</span> Lounge</span></Link>
            </div>
            <div className="flex items-center">
                {/* {!user.isSignedIn && <SignInButton  >
                    <div className={signButtonTailwind}> 
                        Sign In → 
                    </div>
                </SignInButton>}
                
                {!!user.isSignedIn && <SignOutButton > 
                    <div className={signButtonTailwind}>
                        Sign Out →
                    </div>
                </SignOutButton>} */}
                <Link className="p-2 ml-3 border border-white rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer relative" href={"/cart"} >
                    <TiShoppingCart className="text-white text-3xl cursor-pointer " />
                    {hasHydrated && cart.length > 0 && <div className="absolute top-0 right-0 bg-red-500 rounded-full text-white text-xs p-1">{acc}</div>}
                </Link>
            </div>
            {/* <div className="block lg:hidden">
            </div> */}
        </nav>

    )
}