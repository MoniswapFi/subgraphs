import { BigInt } from "@graphprotocol/graph-ts";
import { Gauge, GaugePosition } from "../generated/schema";
import { Deposit as DepositEvent } from "../generated/templates/Gauge/Gauge";
import { BD_ZERO } from "./constants";

export function handleDeposit(event: DepositEvent): void {
    const gaugeId = event.address.toHex();
    const gaugePositionId = gaugeId + "-" + event.params.to.toHex();

    const gauge = Gauge.load(gaugeId) as Gauge;

    let gaugePosition = GaugePosition.load(gaugePositionId);

    if (gaugePosition === null) {
        gaugePosition = new GaugePosition(gaugePositionId);
        gaugePosition.owner = event.params.to;
        gaugePosition.gauge = gauge.id;
        gaugePosition.amount = BD_ZERO;
    }

    const amountDeposited = event.params.amount.toBigDecimal().div(BigInt.fromU64(1e18).toBigDecimal());
    gaugePosition.amount = gaugePosition.amount.plus(amountDeposited);
    gaugePosition.save();
}

export function handleWithdraw(): void {}
