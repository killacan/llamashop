/* eslint-disable */

import { makeStripePrice } from "~/components/pricing";
import { cartItem } from "~/components/useCart";


export const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

export default async function handler(req: any, res:any) {
  console.log("hit the handler")
  if (req.method === 'POST') {
    const cart = JSON.parse(req.body.cart);

    if (!cart) {
      res.status(400).json({error: `${req}`})
    }
    let line_items: Array<unknown> = []

    if (cart.length > 0) {
      line_items = cart.map((item: cartItem) => ({
          price_data: {
              currency: 'usd',
              product_data: {
                  name: item.product.title,
                  images: [item.product.images[0]?.src],
                  metadata: {
                    product_id: item.product.id,
                    variant_id: item.variant.id,
                  }
              },
              unit_amount: makeStripePrice(item.variant.price),
          },
          quantity: item.qty,
      }))
    } else {
      res.status(400).json({error: 'No items in cart'})
    }

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // customer_email: 'customer@example.com',
        // submit_type: 'donate',
        billing_address_collection: 'auto',
        // shipping_address_collection: {
        //   allowed_countries: ['US', 'CA'],
        // },
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: {enabled: true},
      });

      // session.metadata = session.id
      res.redirect(303, session.url);
      console.log(session, 'session')
    } catch (err:any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
