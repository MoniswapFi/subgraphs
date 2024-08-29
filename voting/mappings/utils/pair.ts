import { Address } from "@graphprotocol/graph-ts";
import { Pair } from "../../generated/Voter/Pair";
import { ZERO_ADDRESS } from "../constants";

export function loadToken0(address: Address): Address {
    const contract = Pair.bind(address);
    const call = contract.try_token0();
    return call.reverted ? Address.fromHexString(ZERO_ADDRESS) : call.value;
}

export function loadToken1(address: Address): Address {
    const contract = Pair.bind(address);
    const call = contract.try_token1();
    return call.reverted ? Address.fromHexString(ZERO_ADDRESS) : call.value;
}
