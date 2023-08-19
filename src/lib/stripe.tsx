import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
  appInfo: {
    name: 'llamashop',
    url: 'https://llamashop.vercel.app',
  },
})
