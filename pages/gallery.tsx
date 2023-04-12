import { Navigation, Spinner } from "components";
import { config } from "config";
import { BigNumber, utils } from "ethers";
import { useIsMounted } from "hooks";
import type { NextPage } from "next";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

const SingleNFTDisplay = ({
  nftId,
  refetchUserTokens,
}: {
  nftId: number;
  refetchUserTokens: () => Promise<unknown>;
}) => {
  const { data: approvedInfo, refetch: refetchGetApproved } = useContractRead({
    address: config.nftAddress,
    abi: config.nftAbi,
    functionName: "getApproved",
    args: [BigNumber.from(nftId)],
  });

  const { config: approveConfig } = usePrepareContractWrite({
    address: config.nftAddress,
    abi: config.nftAbi,
    functionName: "approve",
    args: [config.tokenAddress, BigNumber.from(nftId)],
  });
  const { data: approveData, write: approveToken } =
    useContractWrite(approveConfig);
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransaction({
      hash: approveData?.hash,
    });

  const { config: stakeConfig, refetch: refetchStakeContractWrite } =
    usePrepareContractWrite({
      address: config.tokenAddress,
      abi: config.tokenAbi,
      functionName: "stake",
      args: [BigNumber.from(nftId)],
    });
  const { data: stakeData, write: stakeToken } = useContractWrite(stakeConfig);
  const { isLoading: isStakeLoading, isSuccess: isStakeSuccess } =
    useWaitForTransaction({
      hash: stakeData?.hash,
    });

  useEffect(() => {
    if (isApproveSuccess) {
      refetchGetApproved();
      refetchStakeContractWrite();
      toast("Successfully approved your NFT!", { type: "success" });
    }
  }, [isApproveSuccess, refetchGetApproved, refetchStakeContractWrite]);

  useEffect(() => {
    if (isStakeSuccess) {
      refetchUserTokens();
      toast("Successfully staked your NFT!", { type: "success" });
    }
  }, [isStakeSuccess, refetchUserTokens]);

  return (
    <div>
      <div>
        <img
          src={`${config.ipfsUri}/${nftId}.png`}
          alt="NFT"
          className="w-full rounded-md"
        />
        {!approvedInfo || !(approvedInfo === config.tokenAddress) ? (
          <button
            className="w-full py-2 mt-3 text-white bg-blue-500 rounded-md hover:opacity-90 transition-opacity"
            onClick={approveToken}
          >
            {isApproveLoading && <Spinner className="w-6 mx-auto" />}
            {!isApproveLoading && "Approve"}
          </button>
        ) : (
          <button
            className="w-full py-2 mt-3 text-white bg-green-500 rounded-md hover:opacity-90 transition-opacity"
            onClick={stakeToken}
          >
            {isStakeLoading && <Spinner className="w-6 mx-auto" />}
            {!isStakeLoading && "Stake"}
          </button>
        )}
      </div>
    </div>
  );
};

const SingleStakedNFTDisplay = ({
  nftId,
  refetchUserTokens,
}: {
  nftId: number;
  refetchUserTokens: () => Promise<unknown>;
}) => {
  const { data: rewardTokens } = useContractRead({
    address: config.tokenAddress,
    abi: config.tokenAbi,
    functionName: "calculateTokens",
    args: [BigNumber.from(nftId)],
    watch: true,
  });

  const { config: unstakeConfig } = usePrepareContractWrite({
    address: config.tokenAddress,
    abi: config.tokenAbi,
    functionName: "unstake",
    args: [BigNumber.from(nftId)],
  });
  const { data: unstakeData, write: unstakeToken } =
    useContractWrite(unstakeConfig);
  const { isLoading: isUnstakeLoading, isSuccess: isUnstakeSuccess } =
    useWaitForTransaction({
      hash: unstakeData?.hash,
    });

  useEffect(() => {
    if (isUnstakeSuccess) {
      refetchUserTokens();
      toast("Successfully unstaked your NFT with rewards!", {
        type: "success",
      });
    }
  }, [isUnstakeSuccess, refetchUserTokens]);

  return (
    <div>
      <div>
        <img
          src={`${config.ipfsUri}/${nftId}.png`}
          alt="NFT"
          className="w-full rounded-md"
        />
        <p className="mt-2 font-medium">
          Rewards: {utils.formatEther(rewardTokens || "0")} SNK
        </p>
        <button
          className="w-full py-2 mt-2 text-white bg-red-500 rounded-md hover:opacity-90 transition-opacity"
          onClick={unstakeToken}
        >
          {isUnstakeLoading && <Spinner className="w-6 mx-auto" />}
          {!isUnstakeLoading && "Unstake & claim"}
        </button>
      </div>
    </div>
  );
};

const NFTDisplay = ({
  nfts,
  refetchUserTokens,
}: {
  nfts: readonly BigNumber[];
  refetchUserTokens: () => Promise<unknown>;
}) => {
  if (nfts.length === 0) return <p>You don't have any NFTs yet.</p>;

  return (
    <div className="grid md:grid-cols-4 gap-x-4 gap-y-6 grid-cols-2">
      {nfts.map((nft, id) => (
        <SingleNFTDisplay
          nftId={nft.toNumber()}
          refetchUserTokens={refetchUserTokens}
          key={id}
        />
      ))}
    </div>
  );
};

const StakedNFTDisplay = ({
  nfts,
  refetchUserTokens,
}: {
  nfts?: readonly BigNumber[];
  refetchUserTokens: () => Promise<unknown>;
}) => {
  if (!nfts || nfts.length === 0)
    return <p>You don't have any staked NFTs yet.</p>;

  return (
    <div className="grid md:grid-cols-4 gap-x-4 gap-y-6 grid-cols-2">
      {nfts.map((nft, id) => (
        <SingleStakedNFTDisplay
          nftId={nft.toNumber()}
          key={id}
          refetchUserTokens={refetchUserTokens}
        />
      ))}
    </div>
  );
};

const Gallery: NextPage = () => {
  const { isConnected, address } = useAccount();
  const isMounted = useIsMounted();

  const {
    data: userTokens,
    isLoading: userTokensLoading,
    refetch: refetchUserTokens,
  } = useContractReads({
    contracts: [
      {
        address: config.nftAddress,
        abi: config.nftAbi,
        functionName: "getUserTokens",
        args: [address || "0x"],
      },
      {
        address: config.tokenAddress,
        abi: config.tokenAbi,
        functionName: "getHolderTokens",
        args: [address || "0x"],
      },
    ],
  });

  if (!isMounted) return null;

  return (
    <div className="max-w-3xl px-3 py-5 mx-auto mb-6">
      <Navigation />
      {!isConnected && <p>Please connect your account first.</p>}
      {isConnected ? (
        userTokensLoading ? (
          <Spinner className="w-7 h-7" />
        ) : (
          <div>
            <p className="mb-3 font-bold">My NFTs</p>
            <NFTDisplay
              nfts={userTokens?.[0] || []}
              refetchUserTokens={refetchUserTokens}
            />
            <p className="mt-5 mb-3 font-bold">Staked NFTs</p>
            <StakedNFTDisplay
              nfts={userTokens?.[1] || []}
              refetchUserTokens={refetchUserTokens}
            />
          </div>
        )
      ) : null}
    </div>
  );
};

export default Gallery;
