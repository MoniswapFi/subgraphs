import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  Stake as StakeEvent,
  TierAdded as TierAddedEvent,
  Unstake as UnstakeEvent,
  APRChanged as APRChangedEvent,
} from "../generated/Allocator/Allocator";
import { Account, Allocator, Tier } from "../generated/schema";

export function handleStake(event: StakeEvent): void {
  const allocatorId = event.address.toHex();
  let allocator = Allocator.load(allocatorId);

  if (allocator == null) {
    allocator = new Allocator(allocatorId);
    allocator.totalTokensStaked = BigDecimal.zero();
    allocator.totalStakers = 0;
    allocator.apr = BigDecimal.zero();
  }

  const accountId = event.params.account.toHex();
  let account = Account.load(accountId);

  if (account == null) {
    account = new Account(accountId);
    account.amountStaked = BigDecimal.zero();
  }

  if (account.amountStaked.equals(BigDecimal.zero())) {
    account.firstStakeLockPeriod = event.params.lockDuration;
    account.firstStakeTimestamp = event.params.timestamp;
  }

  const amount = event.params.amount.toBigDecimal().div(BigInt.fromU64(1e18 as u64).toBigDecimal());
  account.amountStaked = account.amountStaked.plus(amount);
  account.save();

  if (account.amountStaked.equals(amount)) {
    allocator.totalStakers = allocator.totalStakers + 1;
  }

  allocator.totalTokensStaked = allocator.totalTokensStaked.plus(amount);
  allocator.save();
}

export function handleTierAdded(event: TierAddedEvent): void {
  const allocatorId = event.address.toHex();
  let allocator = Allocator.load(allocatorId);

  if (allocator == null) {
    allocator = new Allocator(allocatorId);
    allocator.totalTokensStaked = BigDecimal.zero();
    allocator.totalStakers = 0;
    allocator.apr = BigDecimal.zero();
  }

  const tier = new Tier(event.address.toHex() + ":" + event.params.name);
  tier.name = event.params.name;
  tier.num = event.params.num.div(BigInt.fromU64(1e18 as u64));
  tier.save();

  allocator.save();
}

export function handleUnstake(event: UnstakeEvent): void {
  const allocatorId = event.address.toHex();
  const allocator = Allocator.load(allocatorId) as Allocator;
  const accountId = event.params.account.toHex();
  const account = Account.load(accountId) as Account;

  const amount = event.params.amount.toBigDecimal().div(BigInt.fromU64(1e18 as u64).toBigDecimal());
  account.amountStaked = BigDecimal.zero();
  account.save();

  if (account.amountStaked.equals(BigDecimal.zero())) {
    allocator.totalStakers = allocator.totalStakers - 1;
  }

  allocator.totalTokensStaked = allocator.totalTokensStaked.minus(amount);
  allocator.save();
}

export function handleAPRChanged(event: APRChangedEvent): void {
  const allocatorId = event.address.toHex();
  let allocator = Allocator.load(allocatorId);

  if (allocator == null) {
    allocator = new Allocator(allocatorId);
    allocator.totalTokensStaked = BigDecimal.zero();
    allocator.totalStakers = 0;
    allocator.apr = BigDecimal.zero();
  }

  allocator.apr = BigDecimal.fromString((event.params.apr / Math.pow(10, 3)).toString());
  allocator.save();
}
