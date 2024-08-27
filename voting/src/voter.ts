import {
  Abstained as AbstainedEvent,
  DistributeReward as DistributeRewardEvent,
  GaugeCreated as GaugeCreatedEvent,
  GaugeKilled as GaugeKilledEvent,
  GaugeRevived as GaugeRevivedEvent,
  NotifyReward as NotifyRewardEvent,
  Voted as VotedEvent,
  WhitelistNFT as WhitelistNFTEvent,
  WhitelistToken as WhitelistTokenEvent
} from "../generated/Voter/Voter"
import {
  Abstained,
  DistributeReward,
  GaugeCreated,
  GaugeKilled,
  GaugeRevived,
  NotifyReward,
  Voted,
  WhitelistNFT,
  WhitelistToken
} from "../generated/schema"

export function handleAbstained(event: AbstainedEvent): void {
  let entity = new Abstained(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.pool = event.params.pool
  entity.tokenId = event.params.tokenId
  entity.weight = event.params.weight
  entity.totalWeight = event.params.totalWeight
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDistributeReward(event: DistributeRewardEvent): void {
  let entity = new DistributeReward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.gauge = event.params.gauge
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGaugeCreated(event: GaugeCreatedEvent): void {
  let entity = new GaugeCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolFactory = event.params.poolFactory
  entity.votingRewardsFactory = event.params.votingRewardsFactory
  entity.gaugeFactory = event.params.gaugeFactory
  entity.pool = event.params.pool
  entity.bribeVotingReward = event.params.bribeVotingReward
  entity.feeVotingReward = event.params.feeVotingReward
  entity.gauge = event.params.gauge
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGaugeKilled(event: GaugeKilledEvent): void {
  let entity = new GaugeKilled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gauge = event.params.gauge

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGaugeRevived(event: GaugeRevivedEvent): void {
  let entity = new GaugeRevived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.gauge = event.params.gauge

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNotifyReward(event: NotifyRewardEvent): void {
  let entity = new NotifyReward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.sender = event.params.sender
  entity.reward = event.params.reward
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoted(event: VotedEvent): void {
  let entity = new Voted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.voter = event.params.voter
  entity.pool = event.params.pool
  entity.tokenId = event.params.tokenId
  entity.weight = event.params.weight
  entity.totalWeight = event.params.totalWeight
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWhitelistNFT(event: WhitelistNFTEvent): void {
  let entity = new WhitelistNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.whitelister = event.params.whitelister
  entity.tokenId = event.params.tokenId
  entity._bool = event.params._bool

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWhitelistToken(event: WhitelistTokenEvent): void {
  let entity = new WhitelistToken(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.whitelister = event.params.whitelister
  entity.token = event.params.token
  entity._bool = event.params._bool

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
