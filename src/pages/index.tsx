import Head from "next/head";
import { api } from "~/utils/api";
import ProductListing from "~/components/productListing";
import { type Product } from "~/components/productInterface";
import { type UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {

  interface Products {
    data: Array<Product>
  }

  const [productsData, setProductsData] = useState<Products | undefined>(undefined);

  const products = api.shopRouter.getProducts.useQuery(undefined, {
    enabled: !productsData,
    onSuccess: (data) => {
      setProductsData(data);
    }
  });

  const productsBuilder = () => {
    if (!productsData) {
      // console.log("no products.data")
      return null; // Return null or loading spinner while data is fetching
    }
    const productList: Array<Product> = productsData.data;
    return productList.map((product: Product, index:number) => (
      <ProductListing product={product} key={index} />
    ));
  };

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
            <div className="grid grid-cols-3 gap-5">
              {productsBuilder()}
            </div>
          </div>

        </div>

      </main>
    </>
  );
}
