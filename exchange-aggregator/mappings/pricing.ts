import { Address, BigDecimal, BigInt, dataSource } from "@graphprotocol/graph-ts";
import { queryAmountOut } from "./utils/adapter";
import { USDC, USDT, WETH, ZERO_BD, ZERO_BI } from "./constants";
import { fetchTokenDecimals } from "./utils/erc20";

function getETHPriceInUSDFromAdapterQuery(address: Address): BigDecimal {
    const network = dataSource.network();
    const WETH_USDT = queryAmountOut(
        address,
        Address.fromString(WETH.get(network) as string),
        Address.fromString(USDT.get(network) as string),
        BigInt.fromU64(1e18 as u64),
    );
    const WETH_USDC = queryAmountOut(
        address,
        Address.fromString(WETH.get(network) as string),
        Address.fromString(USDC.get(network) as string),
        BigInt.fromU64(1e18 as u64),
    );
    let price: BigDecimal = ZERO_BD;

    if (WETH_USDT !== null) {
        const USDT_DECIMALS = fetchTokenDecimals(Address.fromString(USDT.get(network) as string)) as BigInt;
        price = WETH_USDT.toBigDecimal().div(
            BigInt.fromI32(10)
                .pow(USDT_DECIMALS.toI32() as u8)
                .toBigDecimal(),
        );
    }

    if (WETH_USDC !== null) {
        const USDC_DECIMALS = fetchTokenDecimals(Address.fromString(USDC.get(network) as string)) as BigInt;
        price = price.plus(
            WETH_USDC.toBigDecimal().div(
                BigInt.fromI32(10)
                    .pow(USDC_DECIMALS.toI32() as u8)
                    .toBigDecimal(),
            ),
        );
    }

    if (WETH_USDT !== null && WETH_USDC !== null) {
        if (WETH_USDT.gt(ZERO_BI) && WETH_USDC.gt(ZERO_BI)) {
            price = price.div(BigDecimal.fromString("2.0"));
        }
    }

    return price;
}

export function getTokenPriceInUSDFromAdapterQuery(adapter: Address, token: Address): BigDecimal {
    const network = dataSource.network();
    const ethPrice = getETHPriceInUSDFromAdapterQuery(adapter);

    if (token.toHex().toLowerCase() == (WETH.get(network) as string).toLowerCase()) {
        return ethPrice;
    }

    const decimals = fetchTokenDecimals(token) as BigInt;
    const TOKEN_WETH = queryAmountOut(
        adapter,
        token,
        Address.fromString(WETH.get(network) as string),
        BigInt.fromI32(1).times(BigInt.fromI32(10).pow((decimals.toI32() || 18) as u8)),
    );
    let price: BigDecimal = ZERO_BD;

    if (TOKEN_WETH !== null) {
        price = TOKEN_WETH.toBigDecimal()
            .div(BigInt.fromU64(1e18 as u64).toBigDecimal())
            .times(ethPrice);
    }

    return price;
}
