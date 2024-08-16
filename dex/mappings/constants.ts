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
// const CHAPEL = "chapel";
const BERA_TESTNET = "berachain-bartio"

// FACTORY_ADDRESS.set(BSC_TESTNET, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
// WETH.set(BSC_TESTNET, "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd");
// WETH_USDC_PAIR.set(BSC_TESTNET, "0x193028291F3b7973DE385E3bd9Fa654DaE226b3b");
// WETH_USDT_PAIR.set(BSC_TESTNET, "0x2A978EdD4C02c147710cB8142535Fe728c1eff19");
// USDT.set(BSC_TESTNET, "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee");
// USDC.set(BSC_TESTNET, "0x64544969ed7EBf5f083679233325356EbE738930");

// FACTORY_ADDRESS.set(CHAPEL, "0x0542fd4b76074eD67d3031D197119e87c4C7d1FA");
// WETH.set(CHAPEL, "0xae13d989dac2f0debff460ac112a837c89baa7cd");
// WETH_USDC_PAIR.set(CHAPEL, "0x193028291f3b7973de385e3bd9fa654dae226b3b");
// WETH_USDT_PAIR.set(CHAPEL, "0x2a978edd4c02c147710cb8142535fe728c1eff19");
// USDT.set(CHAPEL, "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee");
// USDC.set(CHAPEL, "0x64544969ed7ebf5f083679233325356ebe738930");

FACTORY_ADDRESS.set(BERA_TESTNET, "0xa933091dd8b94D07cE68DF5eA96822A45e3EA819");
WETH.set(BERA_TESTNET, "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8");
WETH_USDC_PAIR.set(BERA_TESTNET, "0x16a36A743391762A50F04227AeC178d328291200");
WETH_USDT_PAIR.set(BERA_TESTNET, "0x97Bd7Ce89b48b63886277D421079238Dba07FCa0");
USDT.set(BERA_TESTNET, "0x05D0dD5135E3eF3aDE32a9eF9Cb06e8D37A6795D");
USDC.set(BERA_TESTNET, "0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c");
