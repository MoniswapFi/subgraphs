import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { Account, CliffPeriod, Contribution, LinearVesting, TokenSale } from "../generated/schema";
import {
  Purchase as PurchaseEvent,
  SetMinTotalPayment as SetMinTotalPaymentEvent,
  EmergencyWithdrawal as EmergencyWithdrawalEvent,
  SetLinearVestingEndTime as SetLinearVestingEndTimeEvent,
  SetCliffVestingPeriod as SetCliffVestingPeriodEvent,
  Fund as FundEvent,
  SetWhitelistStartTime as SetWhitelistStartTimeEvent,
  SetWhitelistEndTime as SetWhitelistEndTimeEvent,
} from "../generated/templates/Presale/Presale";
import { fetchTokenDecimals } from "./utils/erc20";
import { ZERO_BD } from "./constants";

export function handlePurchase(event: PurchaseEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const decimals = fetchTokenDecimals(Address.fromBytes(Bytes.fromHexString(tokenSale.paymentToken))) as BigInt;
  const amount = event.params.paymentAmount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(decimals.toI32() as u8)
      .toBigDecimal(),
  );
  tokenSale.totalPaymentMade = tokenSale.totalPaymentMade.plus(amount);

  const contributionId = event.address.toHex() + ":" + event.params.sender.toHex();
  let contribution = Contribution.load(contributionId);
  let account = Account.load(event.params.sender.toHex());

  if (account === null) {
    account = new Account(event.params.sender.toHex());
    account.contributionsCount = 0;
  }

  if (contribution === null) {
    contribution = new Contribution(contributionId);
    contribution.amount = ZERO_BD;
    contribution.user = account.id;
    contribution.tokenSale = tokenSale.id;

    account.contributionsCount = account.contributionsCount + 1;
    tokenSale.participants = tokenSale.participants + 1;
  }

  contribution.amount = contribution.amount.plus(amount);
  contribution.save();
  account.save();
  tokenSale.save();
}

export function handleFund(event: FundEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const decimals = fetchTokenDecimals(Address.fromBytes(Bytes.fromHexString(tokenSale.saleToken))) as BigInt;
  const amount = event.params.amount.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(decimals.toI32() as u8)
      .toBigDecimal(),
  );
  tokenSale.totalAvailableSaleTokens = tokenSale.totalAvailableSaleTokens.plus(amount);
  tokenSale.save();
}

export function handleSetMinTotalPayment(event: SetMinTotalPaymentEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const decimals = fetchTokenDecimals(Address.fromBytes(Bytes.fromHexString(tokenSale.paymentToken))) as BigInt;

  tokenSale.minTotalPayment = event.params.minTotalPayment.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(decimals.toI32() as u8)
      .toBigDecimal(),
  );
  tokenSale.save();
}

export function handleEmergencyWithdrawal(event: EmergencyWithdrawalEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const contributionId = event.address.toHex() + ":" + event.params.user.toHex();
  const contribution = Contribution.load(contributionId) as Contribution;
  tokenSale.totalPaymentMade = tokenSale.totalPaymentMade.minus(contribution.amount);
  tokenSale.participants = tokenSale.participants - 1;
  tokenSale.save();

  contribution.amount = ZERO_BD;
  contribution.save();
}

export function handleSetLinearVestingEndTime(event: SetLinearVestingEndTimeEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const linearVestingId = event.address.toHex() + ":" + event.params.linearVestingEndTime.toHex();
  let linearVesting = LinearVesting.load(linearVestingId);

  if (linearVesting === null) {
    linearVesting = new LinearVesting(linearVestingId);
  }

  linearVesting.endTime = event.params.linearVestingEndTime;
  linearVesting.save();

  tokenSale.vestingType = "LINEAR";
  tokenSale.linearVesting = linearVestingId;
  tokenSale.cliffPeriod = null;
  tokenSale.save();
}

export function handleSetCliffVestingPeriod(event: SetCliffVestingPeriodEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;

  const cliffs: string[] = [];

  const tuples = ethereum.Value.fromBytes(event.params.cliffPeriod).toTupleArray<ethereum.Tuple>();

  for (let i = 0; i < tuples.length; i++) {
    const tuple = tuples[i];

    const cliffVestingId = event.address.toHex() + ":" + tuple.at(0).toBigInt().toHex();
    let cliffPeriod = CliffPeriod.load(cliffVestingId);

    if (cliffPeriod === null) {
      cliffPeriod = new CliffPeriod(cliffVestingId);
    }

    cliffPeriod.claimTime = tuple.at(0).toBigInt();
    cliffPeriod.percentage = tuple.at(1).toI32() as u8;
    cliffPeriod.save();

    cliffs.push(cliffVestingId);
  }

  tokenSale.vestingType = "CLIFF";
  tokenSale.cliffPeriod = cliffs;
  tokenSale.linearVesting = null;
  tokenSale.save();
}

export function handleSetWhitelistStartTime(event: SetWhitelistStartTimeEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  tokenSale.whitelistStartTime = event.params.whitelistStartTime;
  tokenSale.save();
}

export function handleSetWhitelistEndTime(event: SetWhitelistEndTimeEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  tokenSale.whitelistEndTime = event.params.whitelistEndTime;
  tokenSale.save();
}
