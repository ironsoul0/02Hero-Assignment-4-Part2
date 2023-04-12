import "styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import { config } from "config";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import { createClient, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";

const client = createClient(
  getDefaultClient({
    appName: config.appName,
    infuraId: config.infuraId,
    chains: [bscTestnet],
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer />
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
