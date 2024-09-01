import { Address } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/VotingEscrow/ERC20";

export function loadName(address: Address): string {
    const contract = ERC20.bind(address);
    const call = contract.try_name();
    return call.reverted ? "" : call.value;
}

export function loadSymbol(address: Address): string {
    const contract = ERC20.bind(address);
    const call = contract.try_symbol();
    return call.reverted ? "" : call.value;
}

export function loadDecimals(address: Address): i32 {
    const contract = ERC20.bind(address);
    const call = contract.try_decimals();
    return call.reverted ? 0 : call.value;
}
