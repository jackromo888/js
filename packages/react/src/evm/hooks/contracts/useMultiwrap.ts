import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of an `Multiwrap` contract. This contract is an ERC721 in which you can wrap ERC721, ERC1155 and ERC20 tokens.
 * @param contractAddress - the address of the Multiwrap contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useMultiwrap } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const multiwrap = useMultiwrap("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the multiwrap contract in the rest of the component
 *
 *   // For example, this function will let the connected wallet wrap tokens
 *   async function wrap(tokensToWrap, wrappedNFTMetadata) {
 *     await multiwrap.wrap(tokensToWrap, wrappedNFTMetadata)
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const multiwrap = await sdk.useMultiwrap("0x1234...");
 * + const multiwrap = await sdk.useContract("0x1234...", "multiwrap").contract;
 * ```
 */
export function useMultiwrap(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useMultiwrap("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "multiwrap")`,
  );
  return useContract(contractAddress, "multiwrap").contract;
}
