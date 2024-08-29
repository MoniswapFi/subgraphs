import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const VOTER_FACTORY = new TypedMap<string, string>();

const BERA_TESTNET = "berachain-bartio";

VOTER_FACTORY.set(BERA_TESTNET, "0x6399081084Aff4A927E8704E77bC939703bd892c");

export const BI_ZERO = BigInt.zero();
export const BI_ONE = BigInt.fromU32(1);
export const BD_ZERO = BigDecimal.zero();
export const BD_ONE = BigDecimal.fromString("1.0");
