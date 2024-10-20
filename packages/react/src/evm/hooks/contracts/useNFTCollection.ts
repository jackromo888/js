import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of an `NFTCollection` contract. This contract is meant to interface with ERC721 compliant NFTs.
 * @param contractAddress - the address of the NFT Collection contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useNFTCollection } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const nftCollection = useNFTCollection("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the nftCollection contract in the rest of the component
 *
 *   // For example, this function will return all the NFTs on this contract
 *   async function getNFTs() {
 *     const nfts = await nftCollection.getAll()
 *     return nfts
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const nftCollection = await sdk.useNFTCollection("0x1234...");
 * + const nftCollection = await sdk.useContract("0x1234...", "nft-collection").contract;
 * ```
 */
export function useNFTCollection(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useNFTCollection("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "nft-collection")`,
  );
  return useContract(contractAddress, "nft-collection").contract;
}
