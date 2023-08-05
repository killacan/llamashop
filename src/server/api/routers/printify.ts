import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { createTRPCContext, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { type Product } from "~/components/productInterface";

dotenv.config();

const PRINTIFY_API_KEY = process.env.PRINTIFY_API_KEY;

if (!PRINTIFY_API_KEY || typeof PRINTIFY_API_KEY !== "string") {
    throw new Error("Missing Printify API key");
}

const apiKey: string = PRINTIFY_API_KEY?.toString();

interface Options {
    method: string;
    headers: {
        "Content-Type": string;
        Authorization: string;
    };
  body?: string;
}

// Define a helper function to make requests to the Printify API
async function makePrintifyRequest(path: string, method = "GET", body?: unknown) {
  const apiUrl = "https://api.printify.com/v1";
  const url = `${apiUrl}/${path}`;
  const headers = {
    "Content-Type": "application/json;charset=utf-8",
    Authorization: `Bearer ${apiKey}`,
  };

  const options: Options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  interface DataResponse {
    data: Product[]
    error?: string
  }

  const response = await fetch(url, options);
  const data: DataResponse = (await response.json()) as DataResponse;

  console.log(data, "data")

  if (!response.ok && data.error) {
    throw new Error(`Request to Printify API failed: ${data.error}`);
  }

  return data;
}

export const shopRouter = createTRPCRouter({
  getShops: publicProcedure
    // .input(z.object({}))
    .query(async () => {
        const shops = await makePrintifyRequest("/shops.json");
        // console.log(shops, "shops");
        return shops;
    }
  ),
  getProducts: publicProcedure
    .query(async () => {
        const products = await makePrintifyRequest("/shops/10296800/products.json");
        // console.log(products, "products");
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

