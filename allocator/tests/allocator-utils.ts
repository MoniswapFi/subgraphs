import { newMockEvent } from "matchstick-as";
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
    OwnershipTransferred,
    Paused,
    RoleAdminChanged,
    RoleGranted,
    RoleRevoked,
    Stake,
    TaxPercentageChanged,
    TierAdded,
    Unpaused,
    Unstake,
} from "../generated/Allocator/Allocator";

export function createOwnershipTransferredEvent(previousOwner: Address, newOwner: Address): OwnershipTransferred {
    let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

    ownershipTransferredEvent.parameters = new Array();

    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(previousOwner)));
    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)));

    return ownershipTransferredEvent;
}

export function createPausedEvent(account: Address): Paused {
    let pausedEvent = changetype<Paused>(newMockEvent());

    pausedEvent.parameters = new Array();

    pausedEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));

    return pausedEvent;
}

export function createRoleAdminChangedEvent(role: Bytes, previousAdminRole: Bytes, newAdminRole: Bytes): RoleAdminChanged {
    let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent());

    roleAdminChangedEvent.parameters = new Array();

    roleAdminChangedEvent.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role)));
    roleAdminChangedEvent.parameters.push(new ethereum.EventParam("previousAdminRole", ethereum.Value.fromFixedBytes(previousAdminRole)));
    roleAdminChangedEvent.parameters.push(new ethereum.EventParam("newAdminRole", ethereum.Value.fromFixedBytes(newAdminRole)));

    return roleAdminChangedEvent;
}

export function createRoleGrantedEvent(role: Bytes, account: Address, sender: Address): RoleGranted {
    let roleGrantedEvent = changetype<RoleGranted>(newMockEvent());

    roleGrantedEvent.parameters = new Array();

    roleGrantedEvent.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role)));
    roleGrantedEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));
    roleGrantedEvent.parameters.push(new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender)));

    return roleGrantedEvent;
}

export function createRoleRevokedEvent(role: Bytes, account: Address, sender: Address): RoleRevoked {
    let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent());

    roleRevokedEvent.parameters = new Array();

    roleRevokedEvent.parameters.push(new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role)));
    roleRevokedEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));
    roleRevokedEvent.parameters.push(new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender)));

    return roleRevokedEvent;
}

export function createStakeEvent(account: Address, amount: BigInt, timestamp: BigInt, lockDuration: BigInt): Stake {
    let stakeEvent = changetype<Stake>(newMockEvent());

    stakeEvent.parameters = new Array();

    stakeEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));
    stakeEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));
    stakeEvent.parameters.push(new ethereum.EventParam("timestamp", ethereum.Value.fromUnsignedBigInt(timestamp)));
    stakeEvent.parameters.push(new ethereum.EventParam("lockDuration", ethereum.Value.fromUnsignedBigInt(lockDuration)));

    return stakeEvent;
}

export function createTaxPercentageChangedEvent(newTaxPercentage: i32): TaxPercentageChanged {
    let taxPercentageChangedEvent = changetype<TaxPercentageChanged>(newMockEvent());

    taxPercentageChangedEvent.parameters = new Array();

    taxPercentageChangedEvent.parameters.push(
        new ethereum.EventParam("newTaxPercentage", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newTaxPercentage))),
    );

    return taxPercentageChangedEvent;
}

export function createTierAddedEvent(name: string, num: BigInt): TierAdded {
    let tierAddedEvent = changetype<TierAdded>(newMockEvent());

    tierAddedEvent.parameters = new Array();

    tierAddedEvent.parameters.push(new ethereum.EventParam("name", ethereum.Value.fromString(name)));
    tierAddedEvent.parameters.push(new ethereum.EventParam("num", ethereum.Value.fromUnsignedBigInt(num)));

    return tierAddedEvent;
}

export function createUnpausedEvent(account: Address): Unpaused {
    let unpausedEvent = changetype<Unpaused>(newMockEvent());

    unpausedEvent.parameters = new Array();

    unpausedEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));

    return unpausedEvent;
}

export function createUnstakeEvent(account: Address, amount: BigInt): Unstake {
    let unstakeEvent = changetype<Unstake>(newMockEvent());

    unstakeEvent.parameters = new Array();

    unstakeEvent.parameters.push(new ethereum.EventParam("account", ethereum.Value.fromAddress(account)));
    unstakeEvent.parameters.push(new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount)));

    return unstakeEvent;
}
