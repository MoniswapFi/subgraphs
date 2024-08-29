import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { FACTORY_ADDRESS, ONE_BI, ZERO_BI } from "../constants";
import { PoolFactory as FactoryContract } from "../../generated/templates/Pool/PoolFactory";

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1.0");
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
        bd = bd.times(BigDecimal.fromString("10.0"));
    }
    return bd;
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
        return tokenAmount.toBigDecimal();
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export const factoryContract = (network: string): FactoryContract => FactoryContract.bind(Address.fromString(FACTORY_ADDRESS.get(network) as string));
