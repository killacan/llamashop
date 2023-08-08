import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import { TiShoppingCart } from "react-icons/ti";

export default function Navbar () {

    const user = useUser();

    const signButtonTailwind = "border border-white p-3 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer";

    return (

        <nav className="flex items-center content-center justify-between flex-wrap bg-violet-700 p-6 w-full sticky top-0 z-10">
            <div className="flex flex-shrink-0 text-white mr-6">
                <Link href={"/"} ><span className="font-semibold text-xl tracking-tight p-5">Leisure Llama Lounge</span></Link>
            </div>
            <div className="flex items-center">
                {!user.isSignedIn && <SignInButton  >
                    <div className={signButtonTailwind}> 
                        Sign In → 
                    </div>
                </SignInButton>}
                
                {!!user.isSignedIn && <SignOutButton > 
                    <div className={signButtonTailwind}>
                        Sign Out →
                    </div>
                </SignOutButton>}
                <Link className="p-2 ml-3 border border-white rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer" href={"/cart"} >
                    <TiShoppingCart className="text-white text-3xl cursor-pointer" />
                </Link>
            </div>
            {/* <div className="block lg:hidden">
            </div> */}
        </nav>

    )
}