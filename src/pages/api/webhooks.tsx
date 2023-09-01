/* eslint-disable */

import Stripe from 'stripe';
import {NextApiRequest, NextApiResponse} from 'next';
import { stripe } from './checkout_sessions';
import { makePrintifyOrderRequest } from '~/server/api/routers/printify';

export interface ReadyLineItems {
  product_id: string,
  variant_id: string,
  quantity: number,
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//     apiVersion: '2023-08-16',
//   });

  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'] as string | string[] | Buffer;

    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);

    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data
        .object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
      // console.log(stripeObject)
      // console.log(stripe.checkout.listLineItems(stripeObject), 'listLineItems')
      // const lineItems = await stripe.checkout.sessions.listLineItems(stripeObject.latest_charge, {limit: 100})
      // console.log(stripeObject.metadata, 'metadata')
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
      // console.log(`This is the event data:`, event.data)
    
    } else if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log(`🛍️ Checkout session id: ${checkoutSession.id}`);
      const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id, {limit: 100, expand: ['data.price.product']})
      // console.log(lineItems, 'lineItems')
      // console.log(lineItems.data[0].price, 'lineItems.data[0].price')
      // console.log(checkoutSession.shipping_details?.address, 'checkoutSession.shipping_details?.address')

      interface LineItem {
        id: string, 
        object: string,
        price: {
          id: string,
          object: string,
          active: boolean,
          billing_scheme: string,
          created: number,
          currency: string,
          livemode: boolean,
          lookup_key?: string,
          metadata: {},
          nickname?: string,
          product: {
            id: string,
            object: string,
            active: boolean,
            attributes: [],
            created: number,
            description: string,
            images: [],
            livemode: boolean,
            metadata: {
              product_id: string,
              variant_id: string,
            },
            name: string,
            package_dimensions?: {},
            shippable?: boolean,
          },
          recurring?: {},
        },
        quantity: number,
      }

      interface LineItems {
        object: string;
        data: Array<{
          LineItem: LineItem;
        }>;
        has_more: boolean;
        url: string;
      }

      const transferred_address = {
        address1: checkoutSession.shipping_details?.address?.line1,
        address2: checkoutSession.shipping_details?.address?.line2,
        city: checkoutSession.shipping_details?.address?.city,
        country: checkoutSession.shipping_details?.address?.country,
        region: checkoutSession.shipping_details?.address?.state,
        zip: checkoutSession.shipping_details?.address?.postal_code,
        first_name: checkoutSession.shipping_details?.name?.split(' ')[0],
        last_name: checkoutSession.shipping_details?.name?.split(' ')[1],
      }



      const formattedLineItems = lineItems.data.map((item: LineItem) => ({
        product_id: item.price.product.metadata.product_id,
        variant_id: item.price.product.metadata.variant_id,
        quantity: item.quantity,
      }))

      // console.log(formattedLineItems, 'formattedLineItems')
      // console.log(transferred_address, 'transferred_address')
      
      if (checkoutSession.metadata) {
        const printifyOrder = await makePrintifyOrderRequest("shops/10296800/orders.json", "POST", {
            label: "From Main Site",
            line_items: formattedLineItems,
            shipping_method: 1,
            send_shipping_notification: false,
            address_to: transferred_address,
        });
        // console.log(printifyOrder, 'printifyOrder')
      }

      // console.log(event.data.object, 'event.data.object for checkout session completed')
      
    } else {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    
    // Return a response to acknowledge receipt of the event
    res.json({received: true});
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};



export default handler;
