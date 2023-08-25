import { api } from "~/utils/api";
import "~/styles/globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar";
// import { StripeProvider } from "@stripe/stripe-react-native";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {

  return (

    // <ClerkProvider {...pageProps}>
    // <StripeProvider publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string}>
      <div className="grid grid-rows-[70px_1fr] min-h-screen">
        <Navbar />
        <Component {...pageProps} />
      </div>
    // </StripeProvider>

    // </ClerkProvider>

  );

}

export default api.withTRPC(MyApp);
