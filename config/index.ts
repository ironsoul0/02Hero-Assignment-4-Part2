import { nftAbi, tokenAbi } from "./abi";

export const config = {
  nftAddress: "0xcfDf6bc7f5Bca0274aE80fA852c89a1b671a1a89" as `0x${string}`,
  tokenAddress: "0x954c0CFe9e02045B1F91159f54176Ab658521Fd9" as `0x${string}`,
  infuraId: "f40be16d787e47168253bf632e6a7bcd",
  ipfsUri:
    "https://ipfs.io/ipfs/QmS9KWozgMie7SZMgPbyins2Un3ihMzbaB1egdj8vdgfQD",
  etherscanUri: "https://testnet.bscscan.com/tx",
  nftAbi,
  tokenAbi,
  appName: "NFT Snaking",
  maxSupply: 100,
  tokenSymbol: "SNK",
};
