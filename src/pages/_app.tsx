import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "~/components/navbar";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {

  return (

    <ClerkProvider {...pageProps}>
      <div className="grid grid-rows-[70px_1fr] min-h-screen">
        <Navbar />
        <Component {...pageProps} />
      </div>

    </ClerkProvider>

  );

}

export default api.withTRPC(MyApp);
