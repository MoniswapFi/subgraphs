import { Address, BigInt } from "@graphprotocol/graph-ts";
import { VotingEscrow } from "../../generated/VotingEscrow/VotingEscrow";
import { ZERO_ADDRESS } from "../constants";

export function loadEscrowToken(address: Address): Address {
    const contract = VotingEscrow.bind(address);
    const call = contract.try_token();
    return call.reverted ? Address.fromString(ZERO_ADDRESS) : call.value;
}

export function loadTokenURI(address: Address, tokenId: BigInt): string {
    const contract = VotingEscrow.bind(address);
    const call = contract.try_tokenURI(tokenId);
    return call.reverted ? "" : call.value;
}
