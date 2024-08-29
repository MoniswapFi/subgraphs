import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Adapter } from "../../generated/AggregatorRouter/Adapter";

export const fetchAdapterName = (id: Address): string | null => {
    const contract = Adapter.bind(id);
    const result = contract.try_name();
    return !result.reverted ? result.value : null;
};

export const queryAmountOut = (id: Address, tokenIn: Address, tokenOut: Address, amountIn: BigInt): BigInt | null => {
    const contract = Adapter.bind(id);
    const result = contract.try_query(tokenIn, tokenOut, amountIn);
    return !result.reverted ? result.value : null;
};
