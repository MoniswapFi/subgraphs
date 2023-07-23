import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts";
import { PairDayData, PairHourData, Token, TokenDayData } from "../generated/schema";
import { getTokenPriceInUSDFromAdapterQuery } from "./pricing";
import { ONE_BI, ZERO_BD, ZERO_BI } from "./constants";

export function updateTokenDayData(token: Token, event: ethereum.Event) {
  const timestamp = event.block.timestamp.toI32();
  const dayID = timestamp / 86400;
  const dayStartTimestamp = dayID * 86400;
  const tokenDayID = token.id.toString().concat("-").concat(BigInt.fromI32(dayID).toString());

  let tokenDayData = TokenDayData.load(tokenDayID);

  if (tokenDayData == null) {
    tokenDayData = new TokenDayData(tokenDayID);
    tokenDayData.priceUSD = getTokenPriceInUSDFromAdapterQuery(event.address, Address.fromString(token.id));
    tokenDayData.dailyTxns = ZERO_BI;
    tokenDayData.dailyVolumeToken = ZERO_BD;
    tokenDayData.dailyVolumeUSD = ZERO_BD;
    tokenDayData.token = token.id;
    tokenDayData.date = dayStartTimestamp;
  }
  tokenDayData.dailyTxns = tokenDayData.dailyTxns.plus(ONE_BI);
  tokenDayData.save();
  return tokenDayData;
}

export function updatePairHourData(tokenA: Token, tokenB: Token, event: ethereum.Event) {
  const timestamp = event.block.timestamp.toI32();
  const hourID = timestamp / 3600;
  const hourStartTimeStamp = hourID * 3600;
  const tokens = tokenA.id < tokenB.id ? [tokenA, tokenB] : [tokenB, tokenA];
  const pairHourID = tokens[0].id + "-" + tokens[1].id + "-" + hourID.toString();

  let pairHourData = PairHourData.load(pairHourID);

  if (pairHourData == null) {
    pairHourData = new PairHourData(pairHourID);
    pairHourData.date = hourStartTimeStamp;
    pairHourData.hourlyVolumeUSD = ZERO_BD;
    pairHourData.hourlyVolumeToken1 = ZERO_BD;
    pairHourData.hourlyVolumeToken2 = ZERO_BD;
    pairHourData.token1 = tokens[0].id;
    pairHourData.token2 = tokens[1].id;
  }

  pairHourData.save();
  return pairHourData;
}

export function updatePairDayData(tokenA: Token, tokenB: Token, event: ethereum.Event) {
  const timestamp = event.block.timestamp.toI32();
  const dayID = timestamp / 86400;
  const dayStartTimeStamp = dayID * 86400;
  const tokens = tokenA.id < tokenB.id ? [tokenA, tokenB] : [tokenB, tokenA];
  const pairDayId = tokens[0].id + "-" + tokens[1].id + "-" + dayID.toString();

  let pairDayData = PairDayData.load(pairDayId);

  if (pairDayData == null) {
    pairDayData = new PairDayData(pairDayId);
    pairDayData.date = dayStartTimeStamp;
    pairDayData.dailyVolumeToken1 = ZERO_BD;
    pairDayData.dailyVolumeToken2 = ZERO_BD;
    pairDayData.dailyVolumeUSD = ZERO_BD;
    pairDayData.token1 = tokens[0].id;
    pairDayData.token2 = tokens[1].id;
  }

  pairDayData.save();
  return pairDayData;
}
