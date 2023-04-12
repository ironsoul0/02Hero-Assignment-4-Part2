import clsx from "clsx";
import { config } from "config";
import { ConnectKitButton } from "connectkit";
import { utils } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAccount, useContractRead } from "wagmi";

export const Navigation = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const isMinter = router.pathname === "/";

  const { data: tokensBalance } = useContractRead({
    address: config.tokenAddress,
    abi: config.tokenAbi,
    functionName: "balanceOf",
    args: [address || "0x"],
    watch: true,
    enabled: isConnected,
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <p className="font-bold">{config.appName}</p>
        <div className="flex items-center">
          <p className="px-3 py-2 mr-4 font-medium text-white bg-purple-600 animate-pulse-fast rounded-md">
            {utils.formatEther(tokensBalance || "0")} {config.tokenSymbol}
          </p>
          <ConnectKitButton />
        </div>
      </div>
      <div className="px-3 py-2 my-4 border rounded-md">
        <Link href="/">
          <a className={clsx(isMinter && ["underline", "text-blue-400"])}>
            Minter
          </a>
        </Link>
        <Link href="/gallery">
          <a
            className={clsx(
              !isMinter && ["underline", "text-blue-400"],
              "ml-3"
            )}
          >
            My gallery
          </a>
        </Link>
      </div>
    </div>
  );
};
