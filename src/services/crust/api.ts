import { ApiPromise, WsProvider } from '@polkadot/api'
import { typesBundleForPolkadot } from '@crustio/type-definitions'

const chainWsUrl = process.env.NODE_ENV === 'production' ? process.env.WS_ENDPOINT : 'wss://rpc-crust.decoo.io'

export const api = new ApiPromise({
  provider: new WsProvider(chainWsUrl),

  typesBundle: typesBundleForPolkadot
})
