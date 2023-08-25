import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { createTRPCContext, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { type Product } from "~/components/productInterface";
import { z } from "zod";

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

  // console.log(data, "data")

  if (!response.ok && data.error) {
    throw new Error(`Request to Printify API failed: ${data.error}`);
  }

  return data;
}

async function makePrintifySingleItemRequest(path: string, method = "GET", body?: unknown) {
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
  
  const response = await fetch(url, options);
  const data: Product = (await response.json()) as Product;

  // console.log(data, "data from single item request")

  if (!response.ok && data.error) {
    throw new Error(`Request to Printify API failed: ${data.error}`);
  }

  return data;
}

async function makePrintifyShippingCostRequest(path: string, method = "POST", body?: unknown) {
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

  interface ShippingResponse {
    standard: number,
    express: number,
    priority: number,
    printify_express: number,
    error?: string
  }

  const response = await fetch(url, options);
  const data: ShippingResponse = (await response.json()) as ShippingResponse;

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
  getProduct: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async (opts) => {
        const { id } = opts.input;
        // make sure program does not break if no id is passed
        if (!id) {
          return null;
        }
        const product = await makePrintifySingleItemRequest(`/shops/10296800/products/${id}.json`);
        // console.log(product, "This is the single product");
        return product;
    }
  ),
  getShippingCost: publicProcedure
    .input(z.object({ order: z.object({ address_to: z.object({ first_name: z.string(), last_name: z.string(), address1: z.string(), address2: z.string(), city: z.string(), country_code: z.string(), region: z.string(), zip: z.string() }), line_items: z.object({product_id: z.string(), variant_id: z.number(), quantity: z.number()}).array() }) }))
    .query(async (opts) => {
        const { order } = opts.input;
        // console.log(order, "order");
        const shippingCost = await makePrintifyShippingCostRequest("/shops/10296800/orders/shipping.json", "POST", order);
        // console.log(shippingCost, "shippingCost");
        return shippingCost;
    })
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

