import clsx from "clsx";
import { Navigation, Spinner } from "components";
import { config } from "config";
import { utils } from "ethers";
import { useIsMounted } from "hooks";
import type { NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const MINT_PRICE_ETH = "0.0001";

const Home: NextPage = () => {
  const { isConnected, address } = useAccount();
  const isMounted = useIsMounted();

  const { data, isLoading } = useContractRead({
    address: config.nftAddress,
    abi: config.nftAbi,
    functionName: "totalSupply",
  });
  const { config: writeConfig } = usePrepareContractWrite({
    address: config.nftAddress,
    abi: config.nftAbi,
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

  const nftId = data && data.toNumber() + 1;

  useEffect(() => {
    if (isMintSuccess) {
      toast("Successfully minted your NFT!", { type: "success" });
    }
  }, [isMintSuccess]);

  if (!isMounted) return null;

  return (
    <div className="max-w-3xl px-3 py-5 mx-auto">
      <Navigation />
      {isLoading ? <Spinner className="w-7 h-7" /> : null}
      {nftId ? (
        nftId < config.maxSupply ? (
          <div>
            <p>You are about to mint the following NFT: </p>
            <img
              src={`${config.ipfsUri}/${nftId}.png`}
              alt="NFT"
              className="mt-3 w-44 rounded-md"
            />
            <div className="mt-2">
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
                  {isConnected ? "Mint NFT" : "Connect Wallet"}
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
                  <p>
                    Please visit your{" "}
                    <Link href="/gallery">
                      <a className="text-blue-500 underline">
                        personal gallery
                      </a>
                    </Link>{" "}
                    to stake it.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>Out of stock</p>
        )
      ) : null}
    </div>
  );
};

export default Home;
