import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const ROUTER_ADDRESS = new TypedMap<string, string>();
export const USDC = new TypedMap<string, string>();
export const USDT = new TypedMap<string, string>();
export const WETH = new TypedMap<string, string>();

const BSC_TESTNET = "bscTestnet";

ROUTER_ADDRESS.set(BSC_TESTNET, "0xA2Af4FAe0d22608E3d34698F03ba4c4f75201a73");
WETH.set(BSC_TESTNET, "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
USDT.set(BSC_TESTNET, "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee");
USDC.set(BSC_TESTNET, "0x64544969ed7EBf5f083679233325356EbE738930");

export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();
export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1.0");
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BI_18 = BigInt.fromI32(18);
