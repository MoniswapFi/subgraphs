import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";
import {
    Deposit as DepositEvent,
    DepositManaged as DepositManagedEvent,
    Merge as MergeEvent,
    Split as SplitEvent,
    Transfer as TransferEvent,
    Withdraw as WithdrawEvent,
    WithdrawManaged as WithdrawManagedEvent,
} from "../generated/VotingEscrow/VotingEscrow";
import { EscrowToken, Lock, VotingEscrow } from "../generated/schema";
import { BD_ZERO, BI_ZERO, VOTING_ESCROW, ZERO_ADDRESS } from "./constants";
import { loadEscrowToken, loadTokenURI } from "./utils/escrow";
import { loadDecimals, loadName, loadSymbol } from "./utils/erc20";

export function handleDeposit(event: DepositEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const tokenId = event.params.tokenId;
    const lockId = escrowId + "-" + tokenId.toString();
    const lock = Lock.load(lockId) as Lock;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const amountDeposited = event.params.value.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());

    lock.amountLocked = lock.amountLocked.plus(amountDeposited);
    lock.lockTime = event.params.locktime;
    lock.timestamp = event.params.ts;

    lock.save();
}

export function handleDepositManaged(event: DepositManagedEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const tokenId = event.params._mTokenId;
    const lockId = escrowId + "-" + tokenId.toString();
    const lock = Lock.load(lockId) as Lock;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const amountDeposited = event.params._weight.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());

    lock.amountLocked = lock.amountLocked.plus(amountDeposited);
    lock.timestamp = event.params._ts;

    lock.save();
}

export function handleMerge(event: MergeEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const newTokenId = event.params._to;
    const oldTokenId = event.params._from;
    const newLockId = escrowId + "-" + newTokenId.toString();
    const oldLockId = escrowId + "-" + oldTokenId.toString();

    const newLock = Lock.load(newLockId) as Lock;
    const oldLock = Lock.load(oldLockId) as Lock;

    oldLock.tokenId = BI_ZERO;
    oldLock.tokenURI = "";
    oldLock.owner = Address.fromString(ZERO_ADDRESS);
    oldLock.amountLocked = BD_ZERO;
    oldLock.lockTime = BI_ZERO;
    oldLock.timestamp = BI_ZERO;

    oldLock.save();

    newLock.amountLocked = event.params._amountFinal.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());
    newLock.lockTime = event.params._locktime;
    newLock.save();
}

export function handleSplit(event: SplitEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const oldTokenId = event.params._from;
    const newTokenId0 = event.params._tokenId1;
    const newTokenId1 = event.params._tokenId2;
    const oldLockId = escrowId + "-" + oldTokenId.toString();
    const newLockId0 = escrowId + "-" + newTokenId0.toString();
    const newLockId1 = escrowId + "-" + newTokenId1.toString();

    const oldLock = Lock.load(oldLockId) as Lock;
    const newLock0 = Lock.load(newLockId0) as Lock;
    const newLock1 = Lock.load(newLockId1) as Lock;

    oldLock.tokenId = BI_ZERO;
    oldLock.tokenURI = "";
    oldLock.owner = Address.fromString(ZERO_ADDRESS);
    oldLock.amountLocked = BD_ZERO;
    oldLock.lockTime = BI_ZERO;
    oldLock.timestamp = BI_ZERO;

    oldLock.save();

    const amountLocked0 = event.params._splitAmount1.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());
    const amountLocked1 = event.params._splitAmount2.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());

    newLock0.amountLocked = newLock0.amountLocked.plus(amountLocked0);
    newLock1.amountLocked = newLock1.amountLocked.plus(amountLocked1);
    newLock0.lockTime = event.params._locktime;
    newLock1.lockTime = event.params._locktime;

    newLock0.save();
    newLock1.save();
}

export function handleTransfer(event: TransferEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    let escrow = VotingEscrow.load(escrowId);

    if (escrow === null) {
        escrow = new VotingEscrow(escrowId);
        escrow.lockCount = 0;
    }

    const escrowTokenAddress = loadEscrowToken(Address.fromString(escrowId));
    let escrowToken = EscrowToken.load(escrowTokenAddress.toHex());

    if (escrowToken === null) {
        escrowToken = new EscrowToken(escrowTokenAddress.toHex());
        escrowToken.decimals = loadDecimals(escrowTokenAddress);
        escrowToken.name = loadName(escrowTokenAddress);
        escrowToken.symbol = loadSymbol(escrowTokenAddress);

        escrowToken.save();
    }

    escrow.escrowToken = escrowToken.id;

    const tokenId = event.params.tokenId;
    const lockId = escrowId + "-" + tokenId.toString();

    let lock = Lock.load(lockId);

    if (lock === null) {
        lock = new Lock(lockId);
        lock.tokenId = tokenId;
        lock.lockTime = BI_ZERO;
        lock.amountLocked = BD_ZERO;
        lock.tokenURI = loadTokenURI(Address.fromString(escrowId), tokenId);
        lock.timestamp = BI_ZERO;
    }

    lock.owner = event.params.to;

    lock.save();

    if (event.params.from.toHex() === ZERO_ADDRESS) {
        escrow.lockCount += 1;
    } else if (event.params.to.toHex() === ZERO_ADDRESS) {
        escrow.lockCount -= 1;
    }

    escrow.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const tokenId = event.params.tokenId;
    const lockId = escrow.id + "-" + tokenId.toString();

    const lock = Lock.load(lockId) as Lock;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const amountWithdrawn = event.params.value.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());

    lock.tokenId = BI_ZERO;
    lock.tokenURI = "";
    lock.owner = Address.fromString(ZERO_ADDRESS);
    lock.amountLocked = lock.amountLocked.minus(amountWithdrawn);
    lock.lockTime = BI_ZERO;
    lock.timestamp = BI_ZERO;

    lock.save();
}

export function handleWithdrawManaged(event: WithdrawManagedEvent): void {
    const escrowId = VOTING_ESCROW.get(dataSource.network()) as string;
    const escrow = VotingEscrow.load(escrowId) as VotingEscrow;
    const tokenId = event.params._mTokenId;
    const lockId = escrow.id + "-" + tokenId.toString();

    const lock = Lock.load(lockId) as Lock;
    const escrowToken = EscrowToken.load(escrow.escrowToken) as EscrowToken;
    const amountWithdrawn = event.params._weight.toBigDecimal().div(BigInt.fromU64(10 ** escrowToken.decimals).toBigDecimal());

    lock.tokenId = BI_ZERO;
    lock.tokenURI = "";
    lock.owner = Address.fromString(ZERO_ADDRESS);
    lock.amountLocked = lock.amountLocked.minus(amountWithdrawn);
    lock.lockTime = BI_ZERO;
    lock.timestamp = BI_ZERO;

    lock.save();
}
