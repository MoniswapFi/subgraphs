import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ROUTER_ADDRESS = new TypedMap<string, string>();
export const USDC = new TypedMap<string, string>();
export const USDT = new TypedMap<string, string>();
export const WETH = new TypedMap<string, string>();

ROUTER_ADDRESS.set("goerli", "0xd6351CC74A04F9472dFBA0b5601d5Bb0d93F4E22");
ROUTER_ADDRESS.set("mainnet", "0x8160C59218be97F301a857cD8E72e5d3446621df");
WETH.set("goerli", "0x4200000000000000000000000000000000000006");
WETH.set("mainnet", "0x4200000000000000000000000000000000000006");
USDC.set("goerli", "0x2e9F75DF8839ff192Da27e977CD154FD1EAE03cf");
USDC.set("mainnet", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
USDT.set("goerli", "0x3e8B7c72f4a9f4C8ec375c11F44FB84242c3893F");
USDT.set("mainnet", "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca");

export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();
export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1.0");
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BI_18 = BigInt.fromI32(18);
