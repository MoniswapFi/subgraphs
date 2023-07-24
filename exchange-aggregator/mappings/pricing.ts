import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { queryAmountOut } from "./utils/adapter";
import { USDC, USDT, WETH, ZERO_BD, ZERO_BI } from "./constants";
import { fetchTokenDecimals } from "./utils/erc20";

function getETHPriceInUSDFromAdapterQuery(address: Address): BigDecimal {
  const WETH_USDT = queryAmountOut(address, Address.fromString(WETH), Address.fromString(USDT), BigInt.fromU64(1e18 as u64));
  const WETH_USDC = queryAmountOut(address, Address.fromString(WETH), Address.fromString(USDC), BigInt.fromU64(1e18 as u64));
  let price: BigDecimal = ZERO_BD;

  if (WETH_USDT !== null && WETH_USDC !== null) {
    price = WETH_USDT.plus(WETH_USDC).toBigDecimal();

    if (WETH_USDT.gt(ZERO_BI) && WETH_USDC.gt(ZERO_BI)) {
      price = price.div(BigDecimal.fromString("2.0"));
    }
  }

  return price.div(BigInt.fromU64(1e18 as u64).toBigDecimal());
}

export function getTokenPriceInUSDFromAdapterQuery(adapter: Address, token: Address): BigDecimal {
  const ethPrice = getETHPriceInUSDFromAdapterQuery(adapter);

  if (token.toHex().toLowerCase() == WETH.toLowerCase()) {
    return ethPrice;
  }

  const decimals = fetchTokenDecimals(token) as BigInt;
  const TOKEN_WETH = queryAmountOut(
    adapter,
    token,
    Address.fromString(WETH),
    BigInt.fromI32(1).times(BigInt.fromI32(10).pow((decimals.toI32() || 18) as u8))
  );
  let price: BigDecimal = ZERO_BD;

  if (TOKEN_WETH !== null) {
    price = TOKEN_WETH.toBigDecimal()
      .div(BigInt.fromU64(1e18 as u64).toBigDecimal())
      .times(ethPrice);
  }

  return price;
}
