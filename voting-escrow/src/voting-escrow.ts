import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchMetadataUpdate as BatchMetadataUpdateEvent,
  CreateManaged as CreateManagedEvent,
  DelegateChanged as DelegateChangedEvent,
  DelegateVotesChanged as DelegateVotesChangedEvent,
  Deposit as DepositEvent,
  DepositManaged as DepositManagedEvent,
  LockPermanent as LockPermanentEvent,
  Merge as MergeEvent,
  MetadataUpdate as MetadataUpdateEvent,
  SetAllowedManager as SetAllowedManagerEvent,
  Split as SplitEvent,
  Supply as SupplyEvent,
  Transfer as TransferEvent,
  UnlockPermanent as UnlockPermanentEvent,
  Withdraw as WithdrawEvent,
  WithdrawManaged as WithdrawManagedEvent
} from "../generated/VotingEscrow/VotingEscrow"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  CreateManaged,
  DelegateChanged,
  DelegateVotesChanged,
  Deposit,
  DepositManaged,
  LockPermanent,
  Merge,
  MetadataUpdate,
  SetAllowedManager,
  Split,
  Supply,
  Transfer,
  UnlockPermanent,
  Withdraw,
  WithdrawManaged
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBatchMetadataUpdate(
  event: BatchMetadataUpdateEvent
): void {
  let entity = new BatchMetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._fromTokenId = event.params._fromTokenId
  entity._toTokenId = event.params._toTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateManaged(event: CreateManagedEvent): void {
  let entity = new CreateManaged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._to = event.params._to
  entity._mTokenId = event.params._mTokenId
  entity._from = event.params._from
  entity._lockedManagedReward = event.params._lockedManagedReward
  entity._freeManagedReward = event.params._freeManagedReward

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateChanged(event: DelegateChangedEvent): void {
  let entity = new DelegateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegator = event.params.delegator
  entity.fromDelegate = event.params.fromDelegate
  entity.toDelegate = event.params.toDelegate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDelegateVotesChanged(
  event: DelegateVotesChangedEvent
): void {
  let entity = new DelegateVotesChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.delegate = event.params.delegate
  entity.previousBalance = event.params.previousBalance
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.provider = event.params.provider
  entity.tokenId = event.params.tokenId
  entity.depositType = event.params.depositType
  entity.value = event.params.value
  entity.locktime = event.params.locktime
  entity.ts = event.params.ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDepositManaged(event: DepositManagedEvent): void {
  let entity = new DepositManaged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._owner = event.params._owner
  entity._tokenId = event.params._tokenId
  entity._mTokenId = event.params._mTokenId
  entity._weight = event.params._weight
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLockPermanent(event: LockPermanentEvent): void {
  let entity = new LockPermanent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._owner = event.params._owner
  entity._tokenId = event.params._tokenId
  entity.amount = event.params.amount
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMerge(event: MergeEvent): void {
  let entity = new Merge(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._sender = event.params._sender
  entity._from = event.params._from
  entity._to = event.params._to
  entity._amountFrom = event.params._amountFrom
  entity._amountTo = event.params._amountTo
  entity._amountFinal = event.params._amountFinal
  entity._locktime = event.params._locktime
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = new MetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenId = event.params._tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetAllowedManager(event: SetAllowedManagerEvent): void {
  let entity = new SetAllowedManager(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._allowedManager = event.params._allowedManager

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSplit(event: SplitEvent): void {
  let entity = new Split(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._from = event.params._from
  entity._tokenId1 = event.params._tokenId1
  entity._tokenId2 = event.params._tokenId2
  entity._sender = event.params._sender
  entity._splitAmount1 = event.params._splitAmount1
  entity._splitAmount2 = event.params._splitAmount2
  entity._locktime = event.params._locktime
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSupply(event: SupplyEvent): void {
  let entity = new Supply(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.prevSupply = event.params.prevSupply
  entity.supply = event.params.supply

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnlockPermanent(event: UnlockPermanentEvent): void {
  let entity = new UnlockPermanent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._owner = event.params._owner
  entity._tokenId = event.params._tokenId
  entity.amount = event.params.amount
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.provider = event.params.provider
  entity.tokenId = event.params.tokenId
  entity.value = event.params.value
  entity.ts = event.params.ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawManaged(event: WithdrawManagedEvent): void {
  let entity = new WithdrawManaged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._owner = event.params._owner
  entity._tokenId = event.params._tokenId
  entity._mTokenId = event.params._mTokenId
  entity._weight = event.params._weight
  entity._ts = event.params._ts

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
