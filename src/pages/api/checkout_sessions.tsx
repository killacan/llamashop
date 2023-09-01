/* eslint-disable */

import { makeStripePrice } from "~/components/pricing";
import { cartItem } from "~/components/useCart";

export const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export default async function handler(req: any, res: any) {
  // console.log("hit the handler");
  if (req.method === "POST") {
    const cart = JSON.parse(req.body.cart);
    const address_to = JSON.parse(req.body.address_to);
    // right now shipping cost is just a number, but it could be an object with more info
    // it is set on the cost of standard shipping
    const shippingCost = JSON.parse(req.body.shippingCost);

    if (!cart) {
      res.status(400).json({ error: `${req}` });
    }
    let line_items: Array<unknown> = [];

    if (cart.length > 0) {
      line_items = cart.map((item: cartItem) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
            description: item.variant.title,
            images: [item.product.images[0]?.src],
            metadata: {
              product_id: item.product.id,
              variant_id: item.variant.id,
            }
          },
          unit_amount: makeStripePrice(item.variant.price),
        },
        quantity: item.qty,
      }));
    } else {
      res.status(400).json({ error: "No items in cart" });
    }

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // customer_email: 'customer@example.com',
        // submit_type: 'donate',
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: shippingCost,
                currency: "usd",
              },
              display_name: "standard shipping",
              // delivery_estimate: {
              //   minimum: {
              //     unit: "business_day",
              //     value: 5,
              //   },
              //   maximum: {
              //     unit: "business_day",
              //     value: 7,
              //   },
              // },
            },
          },
          // If I wanted to add another option for shipping, it would look like this:
          // {
          //   shipping_rate_data: {
          //     type: "fixed_amount",
          //     fixed_amount: {
          //       amount: 1500,
          //       currency: "usd",
          //     },
          //     display_name: "Next day air",
          //     // delivery_estimate: {
          //     //   minimum: {
          //     //     unit: "business_day",
          //     //     value: 1,
          //     //   },
          //     //   maximum: {
          //     //     unit: "business_day",
          //     //     value: 1,
          //       // },
          //     // },
          //   },
          // },
        ],
        line_items: line_items,
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: { enabled: true },
        metadata: { address_to: JSON.stringify(address_to) },
      });

      // session.metadata = session.id
      res.redirect(303, session.url);
      // console.log(session, "session");
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
