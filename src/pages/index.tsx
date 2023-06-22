import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const user = useUser();

  return (
    <>
      <Head>
        <title>leisure llama lounge</title>
        <meta name="description" content="Created by Leisure llama" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T</span> App
          </h1>
          
          {!user.isSignedIn && <SignInButton  >
            <div className="border border-white p-5 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer"> 
              Sign In → 
            </div>
          </SignInButton>}
          
          {!!user.isSignedIn && <SignOutButton > 
            <div className="border border-white p-5 rounded-full bg-violet-500 hover:bg-blue-800 cursor-pointer">
              Sign Out →
            </div>
          </SignOutButton>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">

          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>

        </div>

      </main>
    </>
  );
}
