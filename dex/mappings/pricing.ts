import { Address, BigDecimal, dataSource } from "@graphprotocol/graph-ts";
import { Bundle, Pair, Token } from "../generated/schema";
import { ADDRESS_ZERO, ONE_BD, USDC, USDT, WETH, WETH_USDC_PAIR, WETH_USDT_PAIR, ZERO_BD } from "./constants";
import { factoryContract } from "./utils";

export const getETHPriceInUSD = (): BigDecimal => {
    // get network
    const network = dataSource.network();
    // get weth
    const _WETH = WETH.get(network) as string;
    // weth must exist
    if (_WETH == null) return ZERO_BD;
    // get pairs addresses
    const _WETH_USDC_PAIR = WETH_USDC_PAIR.get(network);
    const _WETH_USDT_PAIR = WETH_USDT_PAIR.get(network);
    // fetch eth prices for each stablecoin
    let usdcPair: Pair | null = null;
    let usdtPair: Pair | null = null;

    if (_WETH_USDC_PAIR !== null) usdcPair = Pair.load(_WETH_USDC_PAIR);
    if (_WETH_USDT_PAIR !== null) usdtPair = Pair.load(_WETH_USDT_PAIR);

    // tracked reserves, weights, and prices

    let usdcTrackedReserve: BigDecimal = ZERO_BD;
    let usdcWeight: BigDecimal = ZERO_BD;
    let usdcPrice: BigDecimal = ZERO_BD;

    let usdtTrackedReserve: BigDecimal = ZERO_BD;
    let usdtWeight: BigDecimal = ZERO_BD;
    let usdtPrice: BigDecimal = ZERO_BD;

    if (usdcPair !== null) {
        if (usdcPair.token0.toLowerCase() == _WETH.toLowerCase()) {
            usdcTrackedReserve = usdcPair.reserve0;
            usdcPrice = usdcPair.token1Price;
        } else {
            usdcTrackedReserve = usdcPair.reserve1;
            usdcPrice = usdcPair.token0Price;
        }
    }

    if (usdtPair !== null) {
        if (usdtPair.token0.toLowerCase() == _WETH.toLowerCase()) {
            usdtTrackedReserve = usdtPair.reserve0;
            usdtPrice = usdtPair.token1Price;
        } else {
            usdtTrackedReserve = usdtPair.reserve1;
            usdtPrice = usdtPair.token0Price;
        }
    }

    const totalLiquidityETH = usdcTrackedReserve.plus(usdtTrackedReserve);

    usdcWeight = usdcTrackedReserve.div(totalLiquidityETH);
    usdtWeight = usdtTrackedReserve.div(totalLiquidityETH);

    return usdcPrice.times(usdcWeight).plus(usdtPrice.times(usdtWeight));
};

const MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString("10");

export const findETHPerToken = (token: Token): BigDecimal => {
    const WHITELIST: Array<string> = [
        WETH.get(dataSource.network()) as string,
        USDC.get(dataSource.network()) as string, // USDC
        USDT.get(dataSource.network()) as string, // USDT
    ];

    if (token.id.toLowerCase() == (WETH.get(dataSource.network()) as string).toLowerCase()) {
        return ONE_BD;
    }

    for (let i = 0; i < WHITELIST.length; i++) {
        let pairAddress = factoryContract(dataSource.network()).getPool1(Address.fromString(token.id), Address.fromString(WHITELIST[i]), false);

        if (pairAddress.toHex() == ADDRESS_ZERO) {
            pairAddress = factoryContract(dataSource.network()).getPool1(Address.fromString(token.id), Address.fromString(WHITELIST[i]), true);
        }

        if (pairAddress.toHex() != ADDRESS_ZERO) {
            const pair = Pair.load(pairAddress.toHexString());
            if (pair !== null) {
                if ((pair as Pair).token0 == token.id && (pair as Pair).reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
                    const token1 = Token.load((pair as Pair).token1) as Token;
                    return (pair as Pair).token1Price.times(token1.derivedETH as BigDecimal);
                }

                if ((pair as Pair).token1 == token.id && (pair as Pair).reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
                    const token0 = Token.load((pair as Pair).token0) as Token;
                    return (pair as Pair).token0Price.times(token0.derivedETH as BigDecimal);
                }
            }
        }
    }
    return ZERO_BD;
};

export const getTrackedVolumeInUSD = (
    bundle: Bundle,
    tokenAmount0: BigDecimal,
    token0: Token,
    tokenAmount1: BigDecimal,
    token1: Token,
): BigDecimal => {
    const WHITELIST: Array<string> = [
        WETH.get(dataSource.network()) as string,
        USDC.get(dataSource.network()) as string, // USDC
        USDT.get(dataSource.network()) as string, // USDT
    ];

    const price0 = token0.derivedETH!.times(bundle.ethPrice);
    const price1 = token1.derivedETH!.times(bundle.ethPrice);

    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
    }

    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
        return tokenAmount0.times(price0);
    }

    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount1.times(price1);
    }

    return ZERO_BD;
};

export function getTrackedLiquidityUSD(bundle: Bundle, tokenAmount0: BigDecimal, token0: Token, tokenAmount1: BigDecimal, token1: Token): BigDecimal {
    const price0 = token0.derivedETH!.times(bundle.ethPrice);
    const price1 = token1.derivedETH!.times(bundle.ethPrice);

    const WHITELIST: Array<string> = [
        WETH.get(dataSource.network()) as string,
        USDC.get(dataSource.network()) as string, // USDC
        USDT.get(dataSource.network()) as string, // USDT
    ];

    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
    }

    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
        return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
    }

    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
    }

    return ZERO_BD;
}
