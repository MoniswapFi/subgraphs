import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { AdapterSwap as AdapterSwapEvent } from "../generated/SparkfiRouter/SparkfiAdapter";
import { Adapter, AdapterSwap, Token } from "../generated/schema";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./constants";
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from "./utils/erc20";
import { getTokenPriceInUSDFromAdapterQuery } from "./pricing";
import { updatePairDayData, updatePairHourData, updateRouterDayData, updateTokenDayData } from "./day_updates";

export function handleAdapterSwap(event: AdapterSwapEvent): void {
  const adapter = Adapter.load(event.address.toHex()) as Adapter;
  let tokenIn = Token.load(event.params.tokenIn.toHex());
  let tokenOut = Token.load(event.params.tokenOut.toHex());

  if (tokenIn === null) {
    tokenIn = new Token(event.params.tokenIn.toHex());
    tokenIn.txCount = ZERO_BI;
    tokenIn.tradeVolumeUSD = ZERO_BD;
    tokenIn.tradeVolume = ZERO_BD;

    const name = fetchTokenName(event.params.tokenIn);

    if (name === null) {
      log.debug("could not fetch name", []);
      return;
    }

    const symbol = fetchTokenSymbol(event.params.tokenIn);

    if (symbol === null) {
      log.debug("could not fetch symbol", []);
      return;
    }

    const totalSupply = fetchTokenTotalSupply(event.params.tokenIn);

    if (totalSupply === null) {
      log.debug("could not fetch total supply", []);
      return;
    }

    const decimals = fetchTokenDecimals(event.params.tokenIn);

    if (decimals === null) {
      log.debug("could not fetch decimmals", []);
      return;
    }

    tokenIn.name = name;
    tokenIn.symbol = symbol;
    tokenIn.decimals = decimals;
    tokenIn.totalSupply = totalSupply.div(BigInt.fromI32(10).pow(decimals.toI32() as u8));
  }

  if (tokenOut === null) {
    tokenOut = new Token(event.params.tokenOut.toHex());
    tokenOut.txCount = ZERO_BI;
    tokenOut.tradeVolumeUSD = ZERO_BD;
    tokenOut.tradeVolume = ZERO_BD;

    const name = fetchTokenName(event.params.tokenOut);

    if (name === null) {
      log.debug("could not fetch name", []);
      return;
    }

    const symbol = fetchTokenSymbol(event.params.tokenOut);

    if (symbol === null) {
      log.debug("could not fetch symbol", []);
      return;
    }

    const totalSupply = fetchTokenTotalSupply(event.params.tokenOut);

    if (totalSupply === null) {
      log.debug("could not fetch total supply", []);
      return;
    }

    const decimals = fetchTokenDecimals(event.params.tokenOut);

    if (decimals === null) {
      log.debug("could not fetch decimals", []);
      return;
    }

    tokenOut.name = name;
    tokenOut.symbol = symbol;
    tokenOut.decimals = decimals;
    tokenOut.totalSupply = totalSupply.div(BigInt.fromI32(10).pow(decimals.toI32() as u8));
  }

  const amountIn = event.params.amountIn;
  const amountOut = event.params.amountOut;

  tokenIn.txCount = tokenIn.txCount.plus(ONE_BI);
  tokenIn.priceUSD = getTokenPriceInUSDFromAdapterQuery(Address.fromString(adapter.id), Address.fromString(tokenIn.id));
  tokenIn.tradeVolume = tokenIn.tradeVolume.plus(
    amountIn.toBigDecimal().div(
      BigInt.fromI32(10)
        .pow(tokenIn.decimals.toI32() as u8)
        .toBigDecimal(),
    ),
  );
  tokenIn.tradeVolumeUSD = tokenIn.priceUSD.times(tokenIn.tradeVolume);

  tokenOut.txCount = tokenOut.txCount.plus(ONE_BI);
  tokenOut.priceUSD = getTokenPriceInUSDFromAdapterQuery(Address.fromString(adapter.id), Address.fromString(tokenOut.id));
  tokenOut.tradeVolume = tokenOut.tradeVolume.plus(
    amountOut.toBigDecimal().div(
      BigInt.fromI32(10)
        .pow(tokenOut.decimals.toI32() as u8)
        .toBigDecimal(),
    ),
  );
  tokenOut.tradeVolumeUSD = tokenOut.priceUSD.times(tokenOut.tradeVolume);

  tokenIn.save();
  tokenOut.save();

  const swap = new AdapterSwap(adapter.id + "-" + event.transaction.hash.toHex());

  swap.adapter = adapter.id;
  swap.to = event.params.to;
  swap.transactionHash = event.transaction.hash;
  swap.blockNumber = event.block.number;
  swap.blockTimestamp = event.block.timestamp;
  swap.amountIn = amountIn.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(tokenIn.decimals.toI32() as u8)
      .toBigDecimal(),
  );
  swap.amountOut = amountOut.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(tokenOut.decimals.toI32() as u8)
      .toBigDecimal(),
  );
  swap.tokenIn = tokenIn.id;
  swap.tokenOut = tokenOut.id;

  swap.save();

  const routerDayData = updateRouterDayData(event);
  const tokenInDayData = updateTokenDayData(tokenIn, event);
  const tokenOutDayData = updateTokenDayData(tokenOut, event);
  const pairDayData = updatePairDayData(tokenIn, tokenOut, event);
  const pairHourData = updatePairHourData(tokenIn, tokenOut, event);

  tokenInDayData.dailyVolumeToken = tokenInDayData.dailyVolumeToken.plus(swap.amountIn);
  tokenInDayData.dailyVolumeUSD = tokenInDayData.priceUSD.times(tokenInDayData.dailyVolumeToken);
  tokenInDayData.save();

  tokenOutDayData.dailyVolumeToken = tokenOutDayData.dailyVolumeToken.plus(swap.amountOut);
  tokenOutDayData.dailyVolumeUSD = tokenOutDayData.priceUSD.times(tokenOutDayData.dailyVolumeToken);
  tokenOutDayData.save();

  const tokensVolume = swap.tokenIn < swap.tokenOut ? [swap.amountIn, swap.amountOut] : [swap.amountOut, swap.amountIn];
  const tokensVolumeUSD = [swap.amountIn.times(tokenIn.priceUSD), swap.amountOut.times(tokenOut.priceUSD)];

  pairDayData.dailyVolumeToken1 = pairDayData.dailyVolumeToken1.plus(tokensVolume[0]);
  pairDayData.dailyVolumeToken2 = pairDayData.dailyVolumeToken2.plus(tokensVolume[1]);
  pairDayData.dailyVolumeUSD = tokenInDayData.dailyVolumeUSD.plus(tokenOutDayData.dailyVolumeUSD);
  pairDayData.save();

  routerDayData.dailyVolumeUSD = routerDayData.dailyVolumeUSD.plus(pairDayData.dailyVolumeUSD);
  routerDayData.save();

  pairHourData.hourlyVolumeToken1 = pairHourData.hourlyVolumeToken1.plus(tokensVolume[0]);
  pairHourData.hourlyVolumeToken2 = pairHourData.hourlyVolumeToken2.plus(tokensVolume[1]);
  pairHourData.hourlyVolumeUSD = pairHourData.hourlyVolumeUSD.plus(tokensVolumeUSD[0]).plus(tokensVolumeUSD[1]);
  pairHourData.save();

  adapter.txCount = adapter.txCount + 1;
  adapter.save();
}
