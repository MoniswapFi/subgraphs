import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { CliffPeriod, Contribution, LinearVesting, TokenSale } from "../generated/schema";
import {
  Purchase as PurchaseEvent,
  SetMinTotalPayment as SetMinTotalPaymentEvent,
  EmergencyWithdrawal as EmergencyWithdrawalEvent,
  SetLinearVestingEndTime as SetLinearVestingEndTimeEvent,
  SetCliffVestingPeriod as SetCliffVestingPeriodEvent,
} from "../generated/templates/Presale/Presale";
import { fetchTokenDecimals } from "./utils/erc20";
import { ZERO_BI } from "./constants";

export function handlePurchase(event: PurchaseEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const decimals = fetchTokenDecimals(Address.fromHexString(tokenSale.paymentToken)) as BigInt;
  const amount = event.params.paymentAmount.div(BigInt.fromI32(10).pow(decimals.toI32() as u8));
  tokenSale.totalPaymentMade = tokenSale.totalPaymentMade.plus(amount);
  tokenSale.save();

  const contributionId = event.address.toHex() + ":" + event.params.sender.toHex();
  let contribution = Contribution.load(contributionId);

  if (contribution === null) {
    contribution = new Contribution(contributionId);
    contribution.amount = ZERO_BI;
    contribution.user = event.params.sender;
    contribution.tokenSale = tokenSale.id;
  }

  contribution.amount = contribution.amount.plus(amount);
  contribution.save();
}

export function handleSetMinTotalPayment(event: SetMinTotalPaymentEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const decimals = fetchTokenDecimals(Address.fromHexString(tokenSale.paymentToken)) as BigInt;

  tokenSale.minTotalPayment = event.params.minTotalPayment.div(BigInt.fromI32(10).pow(decimals.toI32() as u8));
  tokenSale.save();
}

export function handleEmergencyWithdrawal(event: EmergencyWithdrawalEvent): void {
  const tokenSale = TokenSale.load(event.address.toHex()) as TokenSale;
  const contributionId = event.address.toHex() + ":" + event.params.user.toHex();
  const contribution = Contribution.load(contributionId) as Contribution;
  tokenSale.totalPaymentMade = tokenSale.totalPaymentMade.minus(contribution.amount);
  tokenSale.save();

  contribution.amount = ZERO_BI;
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

  const tuples = ethereum.Value.fromBytes(event.params.cliffPeriod).toTupleArray();

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
