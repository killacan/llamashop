import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { createTRPCContext, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fetch from "node-fetch";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;

if (!PRINTIFY_API_KEY) {
    throw new Error("Missing Printify API key");
}

// Define a helper function to make requests to the Printify API
async function makePrintifyRequest(path: string, method: string = "GET", body?: any) {
  const apiUrl = "https://api.printify.com/v1";
  const url = `${apiUrl}/${path}`;
  const headers = {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${PRINTIFY_API_KEY}`,
  };

  const options: any = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data: any = await response.json();

  if (!response.ok) {
    throw new Error(`Request to Printify API failed: ${data.error}`);
  }

  return data;
}

export const shopRouter = createTRPCRouter({
  getShops: publicProcedure
    // .input(z.object({}))
    .query(async () => {
        const shops = await makePrintifyRequest("/shops.json");
        console.log(shops, "shops");
        return shops;
    }
  ),
  getProducts: publicProcedure
    .query(async () => {
        const products = await makePrintifyRequest("/shops/10296800/products.json");
        console.log(products, "products");
        return products;
    }
  ),
});

// Define your TRPC API handler
export default createNextApiHandler({
    router: shopRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

