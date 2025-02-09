import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const VOTER_FACTORY = new TypedMap<string, string>();

const BERA_TESTNET = "berachain-bartio";
const BERA_MAINNET = "berachain-mainnet";

VOTER_FACTORY.set(BERA_TESTNET, "0x6399081084Aff4A927E8704E77bC939703bd892c");
VOTER_FACTORY.set(BERA_MAINNET, "0x8160C59218be97F301a857cD8E72e5d3446621df");

export const BI_ZERO = BigInt.zero();
export const BI_ONE = BigInt.fromU32(1);
export const BD_ZERO = BigDecimal.zero();
export const BD_ONE = BigDecimal.fromString("1.0");
