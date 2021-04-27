import { ApiPromise, WsProvider } from '@polkadot/api'
import { typesBundleForPolkadot } from '@crustio/type-definitions'

const chainWsUrl = process.env.CHAIN_WS_URL

export const api = new ApiPromise({
  provider: new WsProvider(chainWsUrl),
  typesBundle: typesBundleForPolkadot
})
