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

// const BSC_TESTNET = "bscTestnet";
const CHAPEL = "chapel";
const BERA_TESTNET = "berachain-public-testnet"

// FACTORY_ADDRESS.set(BSC_TESTNET, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
// WETH.set(BSC_TESTNET, "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
// WETH_USDC_PAIR.set(BSC_TESTNET, "0x193028291F3b7973DE385E3bd9Fa654DaE226b3b");
// WETH_USDT_PAIR.set(BSC_TESTNET, "0x2A978EdD4C02c147710cB8142535Fe728c1eff19");
// USDT.set(BSC_TESTNET, "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee");
// USDC.set(BSC_TESTNET, "0x64544969ed7EBf5f083679233325356EbE738930");

FACTORY_ADDRESS.set(CHAPEL, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
WETH.set(CHAPEL, "0xae13d989dac2f0debff460ac112a837c89baa7cd");
WETH_USDC_PAIR.set(CHAPEL, "0x193028291f3b7973de385e3bd9fa654dae226b3b");
WETH_USDT_PAIR.set(CHAPEL, "0x2a978edd4c02c147710cb8142535fe728c1eff19");
USDT.set(CHAPEL, "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee");
USDC.set(CHAPEL, "0x64544969ed7ebf5f083679233325356ebe738930");

FACTORY_ADDRESS.set(BERA_TESTNET, "0xe0C2aC5716da69382a3ba3C20E43b91Ada068Fb6");
WETH.set(BERA_TESTNET, "0xe0c2ac5716da69382a3ba3c20e43b91ada068fb6");
WETH_USDC_PAIR.set(BERA_TESTNET, "0x8977322cb080f0e5736c8c29ed9cec3688d2ef96");
WETH_USDT_PAIR.set(BERA_TESTNET, "0x");
USDT.set(BERA_TESTNET, "0x");
USDC.set(BERA_TESTNET, "0x6581e59a1c8da66ed0d313a0d4029dce2f746cc5");
