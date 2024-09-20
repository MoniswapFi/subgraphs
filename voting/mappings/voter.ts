import { Address, dataSource } from "@graphprotocol/graph-ts";
import {
    GaugeCreated as GaugeCreatedEvent,
    GaugeKilled as GaugeKilledEvent,
    GaugeRevived as GaugeRevivedEvent,
    Voted as VotedEvent,
    Abstained as AbstainedEvent,
} from "../generated/Voter/Voter";
import { Gauge, LP, LPToken, Voter, VotePosition } from "../generated/schema";
import { Gauge as GaugeTemplate } from "../generated/templates";
import { BD_ZERO, VOTER_FACTORY, ZERO_ADDRESS } from "./constants";
import { loadDecimals, loadName, loadSymbol } from "./utils/erc20";
import { loadToken0, loadToken1 } from "./utils/pair";

export function handleGaugeCreated(event: GaugeCreatedEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const poolId = event.params.pool.toHex();
    let voter = Voter.load(voterId);
    let pair = LP.load(poolId);

    if (voter === null) {
        voter = new Voter(voterId);

        voter.gaugesAlive = 0;
        voter.gaugesCount = 0;
        voter.gaugesDead = 0;
    }

    if (pair === null) {
        pair = new LP(poolId);

        pair.name = loadName(Address.fromString(poolId));
        pair.symbol = loadSymbol(Address.fromString(poolId));
    }

    const token0Id = loadToken0(Address.fromString(poolId)).toHex();
    const token1Id = loadToken1(Address.fromString(poolId)).toHex();

    let token0 = LPToken.load(token0Id);
    let token1 = LPToken.load(token1Id);

    if (token0 === null) {
        token0 = new LPToken(token0Id);
        token0.decimals = loadDecimals(Address.fromString(token0Id));
        token0.symbol = loadSymbol(Address.fromString(token0Id));
        token0.name = loadName(Address.fromString(token0Id));

        token0.save();
    }

    if (token1 === null) {
        token1 = new LPToken(token1Id);
        token1.decimals = loadDecimals(Address.fromString(token1Id));
        token1.symbol = loadSymbol(Address.fromString(token1Id));
        token1.name = loadName(Address.fromString(token1Id));

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

export function handleVoted(event: VotedEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const lockId = event.params.tokenId;
    const pairId = event.params.pool.toHex();
    const votePositionId = voterId + "-" + lockId.toHex() + "-" + pairId + "-" + event.params.voter.toHex();
    const pair = LP.load(pairId) as LP;
    let votePosition = VotePosition.load(votePositionId);

    if (votePosition === null) {
        votePosition = new VotePosition(votePositionId);
    }

    votePosition.lockId = lockId;
    votePosition.account = event.params.voter;
    votePosition.blockTimestamp = event.params.timestamp;
    votePosition.pair = pair.id;
    votePosition.save();
}

export function handleAbstained(event: AbstainedEvent): void {
    const voterId = VOTER_FACTORY.get(dataSource.network()) as string;
    const lockId = event.params.tokenId;
    const votePositionId = voterId + "-" + lockId.toHex() + "-" + event.params.pool.toHex() + "-" + event.params.voter.toHex();
    const votePosition = VotePosition.load(votePositionId) as VotePosition;

    votePosition.lockId = null;
    votePosition.account = Address.fromString(ZERO_ADDRESS);
    votePosition.pair = null;
    votePosition.save();
}
