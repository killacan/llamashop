import Head from "next/head";
import { api } from "~/utils/api";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Home() {

  const getShops = api.shopRouter.getShops.useQuery();
  const getBlueprints = api.shopRouter.getProducts.useQuery();

  return (
    <>
      <Head>
        <title>leisure llama lounge</title>
        <meta name="description" content="Created by Leisure llama" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Leisure <span className="text-[hsl(280,100%,70%)]">Llama</span> Lounge
          </h1>

          <p className="text-2xl text-white">
            Welcome to the Leisure Llama Lounge! Featuring products from your favorite Llama on Twitch and YouTube!
          </p>
          
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">

          </div>

          <div className="">
            <h2 className="text-2xl">products</h2>

          </div>

        </div>

      </main>
    </>
  );
}
