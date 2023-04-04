import "styles/globals.css";

import { config } from "config";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import type { AppProps } from "next/app";
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
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
