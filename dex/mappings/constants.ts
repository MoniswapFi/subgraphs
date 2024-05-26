import { BigDecimal, BigInt, TypedMap } from "@graphprotocol/graph-ts";

export const FACTORY_ADDRESS = new TypedMap<string, string>();
export const ZERO_BI = BigInt.zero();
export const ZERO_BD = BigDecimal.zero();
export const ONE_BI = BigInt.fromI32(1);
export const ONE_BD = BigDecimal.fromString("1.0");
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const BI_18 = BigInt.fromI32(18);

export const WETH = new TypedMap<string, string>();
export const WETH_USDT_PAIR = new TypedMap<string, string>();
export const WETH_USDC_PAIR = new TypedMap<string, string>();
export const USDT = new TypedMap<string, string>();
export const USDC = new TypedMap<string, string>();

const BSC_TESTNET = "bscTestnet";
const CHAPEL = "chapel";

FACTORY_ADDRESS.set(BSC_TESTNET, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
WETH.set(BSC_TESTNET, "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
WETH_USDC_PAIR.set(BSC_TESTNET, "0x193028291F3b7973DE385E3bd9Fa654DaE226b3b");
WETH_USDT_PAIR.set(BSC_TESTNET, "0x2A978EdD4C02c147710cB8142535Fe728c1eff19");
USDT.set(BSC_TESTNET, "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee");
USDC.set(BSC_TESTNET, "0x64544969ed7EBf5f083679233325356EbE738930");

FACTORY_ADDRESS.set(CHAPEL, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
WETH.set(CHAPEL, "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
WETH_USDC_PAIR.set(CHAPEL, "0x193028291F3b7973DE385E3bd9Fa654DaE226b3b");
WETH_USDT_PAIR.set(CHAPEL, "0x2A978EdD4C02c147710cB8142535Fe728c1eff19");
USDT.set(CHAPEL, "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee");
USDC.set(CHAPEL, "0x64544969ed7EBf5f083679233325356EbE738930");
