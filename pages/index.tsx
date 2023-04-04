import clsx from "clsx";
import { Spinner } from "components";
import { config } from "config";
import { ConnectKitButton } from "connectkit";
import { utils } from "ethers";
import { useIsMounted } from "hooks";
import type { NextPage } from "next";
import Head from "next/head";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const MINT_PRICE_ETH = "0.0";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const isMounted = useIsMounted();

  const { data, isLoading } = useContractRead({
    address: config.nftAddress,
    abi: config.abi,
    functionName: "totalSupply",
  });
  const { config: writeConfig } = usePrepareContractWrite({
    address: config.nftAddress,
    abi: config.abi,
    functionName: "safeMint",
    args: [address || "0x"],
    enabled: isConnected,
    overrides: {
      value: utils.parseEther(MINT_PRICE_ETH),
    },
  });
  const { data: mintData, write: mintToken } = useContractWrite(writeConfig);
  const { isLoading: isMintLoading, isSuccess: isMintSuccess } =
    useWaitForTransaction({
      hash: mintData?.hash,
    });

  const nftId = data && data.toNumber();

  if (!isMounted) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-2xl px-3 py-5 mx-auto">
        <div className="flex justify-between">
          <p className="font-bold">NFT Marketplace</p>
          <ConnectKitButton />
        </div>
        {isLoading ? <Spinner className="w-7 h-7" /> : null}
        {nftId ? (
          nftId < config.maxSupply ? (
            <div>
              <p>You are about to mint the following NFT: </p>
              <img
                src={`${config.ipfsUri}/${nftId}.png`}
                alt="NFT"
                className="w-32 mt-3 rounded-md"
              />
              <div className="mt-3">
                <p>
                  Price: <b>{MINT_PRICE_ETH} ETH</b>
                </p>
                <p>
                  ID: <b>{nftId}</b>
                </p>
                {!isMintLoading && !isMintSuccess && (
                  <button
                    className={clsx(
                      "px-4 py-1 mt-1 text-white bg-green-500 rounded-md transition-opacity",
                      !isConnected && ["bg-gray-500 cursor-not-allowed"],
                      isConnected && ["hover:opacity-90"]
                    )}
                    onClick={() => mintToken?.()}
                  >
                    {isConnected ? "Mint" : "Connect Wallet"}
                  </button>
                )}
                {isMintLoading && <Spinner className="w-5 mt-1" />}
                {isMintSuccess && (
                  <div>
                    Successfully minted{" "}
                    <a
                      target="_blank"
                      href={`${config.etherscanUri}/${mintData?.hash}`}
                      rel="noreferrer"
                      className="text-blue-500 underline"
                    >
                      your NFT!
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Out of stock</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Home;
