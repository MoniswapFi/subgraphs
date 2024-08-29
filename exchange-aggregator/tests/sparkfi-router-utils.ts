import { newMockEvent } from "matchstick-as";
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
    OwnershipTransferred,
    RoleAdminChanged,
    RoleGranted,
    RoleRevoked,
    RouterSwap,
    SetAdapters,
    UpdatedMinFee,
} from "../generated/SparkfiRouter/SparkfiRouter";

export function createOwnershipTransferredEvent(previousOwner: Address, newOwner: Address): OwnershipTransferred {
    let ownershipTransferredEvent = changetype<OwnershipTransferred>(newMockEvent());

    ownershipTransferredEvent.parameters = new Array();

    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("previousOwner", ethereum.Value.fromAddress(previousOwner)));
    ownershipTransferredEvent.parameters.push(new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner)));

    return ownershipTransferredEvent;
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

export function createRouterSwapEvent(tokenIn: Address, tokenOut: Address, to: Address, amountIn: BigInt, amountOut: BigInt): RouterSwap {
    let routerSwapEvent = changetype<RouterSwap>(newMockEvent());

    routerSwapEvent.parameters = new Array();

    routerSwapEvent.parameters.push(new ethereum.EventParam("tokenIn", ethereum.Value.fromAddress(tokenIn)));
    routerSwapEvent.parameters.push(new ethereum.EventParam("tokenOut", ethereum.Value.fromAddress(tokenOut)));
    routerSwapEvent.parameters.push(new ethereum.EventParam("to", ethereum.Value.fromAddress(to)));
    routerSwapEvent.parameters.push(new ethereum.EventParam("amountIn", ethereum.Value.fromUnsignedBigInt(amountIn)));
    routerSwapEvent.parameters.push(new ethereum.EventParam("amountOut", ethereum.Value.fromUnsignedBigInt(amountOut)));

    return routerSwapEvent;
}

export function createSetAdaptersEvent(adapters: Array<Address>): SetAdapters {
    let setAdaptersEvent = changetype<SetAdapters>(newMockEvent());

    setAdaptersEvent.parameters = new Array();

    setAdaptersEvent.parameters.push(new ethereum.EventParam("adapters", ethereum.Value.fromAddressArray(adapters)));

    return setAdaptersEvent;
}

export function createUpdatedMinFeeEvent(newMinfee: BigInt): UpdatedMinFee {
    let updatedMinFeeEvent = changetype<UpdatedMinFee>(newMockEvent());

    updatedMinFeeEvent.parameters = new Array();

    updatedMinFeeEvent.parameters.push(new ethereum.EventParam("newMinfee", ethereum.Value.fromUnsignedBigInt(newMinfee)));

    return updatedMinFeeEvent;
}
