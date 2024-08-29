import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { OwnershipTransferred, PresaleCreated, RoleAdminChanged, RoleGranted, RoleRevoked } from "../generated/PresaleFactory/PresaleFactory";

export function createOwnershipTransferredEvent(previousOwner: Address, newOwner: Address): OwnershipTransferred {
    let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

    ownershipTransferredEvent.parameters = new Array();

    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(previousOwner)));
    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)));

    return ownershipTransferredEvent;
}

export function createPresaleCreatedEvent(
    presaleId: Address,
    metadataURI: string,
    funder: Address,
    salePrice: BigInt,
    paymentToken: Address,
    saleToken: Address,
    startTime: BigInt,
    endTime: BigInt,
    minTotalPayment: BigInt,
    maxTotalPayment: BigInt,
    withdrawDelay: i32,
): PresaleCreated {
    let presaleCreatedEvent = changetype<PresaleCreated>(newMockEvent());

    presaleCreatedEvent.parameters = new Array();

    presaleCreatedEvent.parameters.push(new ethereum.EventParam("presaleId", ethereum.Value.fromAddress(presaleId)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("metadataURI", ethereum.Value.fromString(metadataURI)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("funder", ethereum.Value.fromAddress(funder)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("salePrice", ethereum.Value.fromUnsignedBigInt(salePrice)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("paymentToken", ethereum.Value.fromAddress(paymentToken)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("saleToken", ethereum.Value.fromAddress(saleToken)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("startTime", ethereum.Value.fromUnsignedBigInt(startTime)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("endTime", ethereum.Value.fromUnsignedBigInt(endTime)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("minTotalPayment", ethereum.Value.fromUnsignedBigInt(minTotalPayment)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("maxTotalPayment", ethereum.Value.fromUnsignedBigInt(maxTotalPayment)));
    presaleCreatedEvent.parameters.push(new ethereum.EventParam("withdrawDelay", ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(withdrawDelay))));

    return presaleCreatedEvent;
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
