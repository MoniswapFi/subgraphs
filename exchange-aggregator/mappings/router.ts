import { BigInt, dataSource, log } from "@graphprotocol/graph-ts";
import { SetAdapters as SetAdaptersEvent, RouterSwap as RouterSwapEvent } from "../generated/SparkfiRouter/SparkfiRouter";
import { Adapter, Router, RouterSwap, Token } from "../generated/schema";
import { Adapter as AdapterTemplate } from "../generated/templates";
import { ROUTER_ADDRESS } from "./constants";
import { fetchAdapterName } from "./utils/adapter";

export function handleSetAdapters(event: SetAdaptersEvent): void {
  const network = dataSource.network();
  let router = Router.load(ROUTER_ADDRESS.get(network) as string);

  if (router == null) {
    router = new Router(ROUTER_ADDRESS.get(network) as string);
    router.swapCount = 0;
  }

  const adapters = event.params.adapters;

  for (let i = 0; i < adapters.length; i++) {
    let adapter = Adapter.load(adapters[i].toHexString());
    if (adapter == null) {
      adapter = new Adapter(adapters[i].toHexString());
      const adapterName = fetchAdapterName(adapters[i]);

      if (adapterName == null) {
        log.debug("adapter name not found", []);
        return;
      }

      adapter.name = adapterName as string;
      adapter.txCount = 0;
    }

    adapter.save();
  }
  router.adaptersCount = adapters.length;
  router.adapters = adapters.map<string>(x => x.toHex());

  router.save();

  for (let i = 0; i < adapters.length; i++) {
    AdapterTemplate.create(adapters[i]);
  }
}

export function handleRouterSwap(event: RouterSwapEvent): void {
  const network = dataSource.network();
  const router = Router.load(ROUTER_ADDRESS.get(network) as string) as Router;
  const swap = new RouterSwap(event.address.toHex() + "-" + event.transaction.hash.toHex());
  const tokenIn = Token.load(event.params.tokenIn.toHex()) as Token;
  const tokenOut = Token.load(event.params.tokenOut.toHex()) as Token;
  const amountIn = event.params.amountIn.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(tokenIn.decimals.toI32() as u8)
      .toBigDecimal(),
  );
  const amountOut = event.params.amountOut.toBigDecimal().div(
    BigInt.fromI32(10)
      .pow(tokenOut.decimals.toI32() as u8)
      .toBigDecimal(),
  );

  swap.amountIn = amountIn;
  swap.amountOut = amountOut;
  swap.tokenIn = event.params.tokenIn.toHex();
  swap.tokenOut = event.params.tokenOut.toHex();
  swap.blockNumber = event.block.number;
  swap.transactionHash = event.transaction.hash;
  swap.blockTimestamp = event.block.timestamp;
  swap.to = event.params.to;
  swap.router = router.id;

  swap.save();

  router.swapCount = router.swapCount + 1;
  router.save();
}
