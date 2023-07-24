import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const ROUTER_ADDRESS = "0xC17573eC77381E358adB9b36CA9774E7302ce068";
export const WETH = "0x4200000000000000000000000000000000000006";
export const USDC = "0x2e9F75DF8839ff192Da27e977CD154FD1EAE03cf";
export const USDT = "0x3e8B7c72f4a9f4C8ec375c11F44FB84242c3893F";
export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();
export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1.0");
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BI_18 = BigInt.fromI32(18);
