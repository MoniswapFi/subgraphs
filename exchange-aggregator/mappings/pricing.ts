import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { queryAmountOut } from "./utils/adapter";
import { USDC, USDT, WETH } from "./constants";
import { fetchTokenDecimals } from "./utils/erc20";

function getETHPriceInUSDFromAdapterQuery(address: Address): BigDecimal {
  const WETH_USDT = queryAmountOut(address, Address.fromString(WETH), Address.fromString(USDT), BigInt.fromI32(1e18));
  const WETH_USDC = queryAmountOut(address, Address.fromString(WETH), Address.fromString(USDC), BigInt.fromI32(1e18));
  let price: BigDecimal = BigDecimal.zero();

  if (WETH_USDT != null && WETH_USDC != null) {
    price = WETH_USDT.plus(WETH_USDC).toBigDecimal();

    if (WETH_USDT.gt(BigInt.zero()) && WETH_USDC.gt(BigInt.zero())) {
      price = price.div(BigDecimal.fromString("2.0"));
    }
  }

  return price.div(BigInt.fromI32(1e18).toBigDecimal());
}

export function getTokenPriceInUSDFromAdapterQuery(adapter: Address, token: Address): BigDecimal {
  const ethPrice = getETHPriceInUSDFromAdapterQuery(adapter);
  const decimals = fetchTokenDecimals(token);
  const TOKEN_WETH = queryAmountOut(
    adapter,
    token,
    Address.fromString(WETH),
    BigInt.fromI32(1).times(BigInt.fromI32(10).pow((decimals?.toI32() || 18) as u8))
  );
  let price: BigDecimal = BigDecimal.zero();

  if (TOKEN_WETH != null) {
    price = TOKEN_WETH.toBigDecimal().div(BigInt.fromI32(1e18).toBigDecimal()).times(ethPrice);
  }

  return price;
}
