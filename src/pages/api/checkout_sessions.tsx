import { useCartState } from "~/components/useCart";
import { makeStripePrice } from "~/components/pricing";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: any, res:any) {
  if (req.method === 'POST') {

    const cart = useCartState(state => state.cart)

    const line_items = cart.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.product.title,
                images: [item.product.images[0]?.src],
            },
            unit_amount: makeStripePrice(item.variant.cost),
        },
        quantity: item.qty,
    }))

    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        // customer_email: 'customer@example.com',
        // submit_type: 'donate',
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        line_items: line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
        automatic_tax: {enabled: true},
      });
      res.redirect(303, session.url);
    } catch (err:any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}