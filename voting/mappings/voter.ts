import { Address, dataSource } from "@graphprotocol/graph-ts";
import { GaugeCreated as GaugeCreatedEvent, GaugeKilled as GaugeKilledEvent, GaugeRevived as GaugeRevivedEvent } from "../generated/Voter/Voter";
import { Gauge, Pair, Token, Voter } from "../generated/schema";
import { Gauge as GaugeTemplate } from "../generated/templates";
import { BD_ZERO, VOTER_FACTORY } from "./constants";
import { loadDecimals, loadName, loadSymbol } from "./utils/erc20";
import { loadToken0, loadToken1 } from "./utils/pair";

export function handleGaugeCreated(event: GaugeCreatedEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const poolId = event.params.pool.toHex();
    let voter = Voter.load(voterId);
    let pair = Pair.load(poolId);

    if (voter === null) {
        voter = new Voter(voterId);

        voter.gaugesAlive = 0;
        voter.gaugesCount = 0;
        voter.gaugesDead = 0;
    }

    if (pair === null) {
        pair = new Pair(poolId);

        pair.name = loadName(Address.fromHexString(poolId));
        pair.symbol = loadSymbol(Address.fromHexString(poolId));
    }

    const token0Id = loadToken0(Address.fromHexString(poolId)).toHex();
    const token1Id = loadToken1(Address.fromHexString(poolId)).toHex();

    let token0 = Token.load(token0Id);
    let token1 = Token.load(token1Id);

    if (token0 === null) {
        token0 = new Token(token0Id);
        token0.decimals = loadDecimals(Address.fromHexString(token0Id));
        token0.symbol = loadSymbol(Address.fromHexString(token0Id));
        token0.name = loadName(Address.fromHexString(token0Id));

        token0.save();
    }

    if (token1 === null) {
        token1 = new Token(token1Id);
        token1.decimals = loadDecimals(Address.fromHexString(token1Id));
        token1.symbol = loadSymbol(Address.fromHexString(token1Id));
        token1.name = loadName(Address.fromHexString(token1Id));

        token1.save();
    }

    pair.token0 = token0.id;
    pair.token1 = token1.id;

    pair.save();

    const gaugeId = event.params.gauge.toHex();
    const gauge = new Gauge(gaugeId);

    gauge.alive = true;
    gauge.availableRewards = BD_ZERO;
    gauge.totalDeposits = BD_ZERO;
    gauge.blockNumber = event.block.number;
    gauge.blockTimestamp = event.block.timestamp;
    gauge.bribeVotingReward = event.params.bribeVotingReward;
    gauge.creator = event.params.creator;
    gauge.feeVotingReward = event.params.feeVotingReward;
    gauge.gaugeFactory = event.params.gaugeFactory;
    gauge.pair = pair.id;
    gauge.poolFactory = event.params.poolFactory;
    gauge.votingRewardsFactory = event.params.votingRewardsFactory;
    gauge.save();

    voter.gaugesAlive += 1;
    voter.gaugesCount += 1;
    voter.save();

    GaugeTemplate.create(event.params.gauge);
}

export function handleGaugeKilled(event: GaugeKilledEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const gaugeId = event.params.gauge.toHex();

    const voter = Voter.load(voterId) as Voter;
    const gauge = Gauge.load(gaugeId) as Gauge;

    voter.gaugesAlive -= 1;
    voter.gaugesDead += 1;
    voter.save();

    gauge.alive = false;
    gauge.save();
}

export function handleGaugeRevived(event: GaugeRevivedEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const gaugeId = event.params.gauge.toHex();

    const voter = Voter.load(voterId) as Voter;
    const gauge = Gauge.load(gaugeId) as Gauge;

    voter.gaugesAlive += 1;
    voter.gaugesDead -= 1;
    voter.save();

    gauge.alive = true;
    gauge.save();
}
