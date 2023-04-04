export const config = {
  nftAddress: "0x95eab98e2b37867e86372361d9996c0edbd5d076" as `0x${string}`,
  infuraId: "f40be16d787e47168253bf632e6a7bcd",
  ipfsUri:
    "https://ipfs.io/ipfs/QmZmsHnadyws9is5KApM1ovqLE5g31oVMgTT714yd1FkWj",
  etherscanUri: "https://testnet.bscscan.com/tx",
  abi: [
    {
      name: "totalSupply",
      inputs: [],
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      name: "safeMint",
      inputs: [{ name: "_to", type: "address" }],
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ] as const,
  appName: "NFT Marketplace",
  maxSupply: 5,
};
