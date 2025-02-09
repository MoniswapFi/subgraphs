import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const VOTING_ESCROW = new TypedMap<string, string>();

const BERA_TESTNET = "berachain-bartio";
const BERA_MAINNET = "berachain-mainnet";

VOTING_ESCROW.set(BERA_TESTNET, "0xd11163343Ca6a4e5feADdbB979567A7853e6F20a");
VOTING_ESCROW.set(BERA_MAINNET, "0xB8da258a2B2A8AE31Aab6494D7DC784dC96e5b78");

export const BI_ZERO = BigInt.zero();
export const BI_ONE = BigInt.fromU32(1);
export const BD_ZERO = BigDecimal.zero();
export const BD_ONE = BigDecimal.fromString("1.0");
