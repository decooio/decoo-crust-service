import { ApiPromise, WsProvider } from '@polkadot/api'
import { typesBundleForPolkadot } from '@crustio/type-definitions'

const chainWsUrl = 'wss://rocky-api.crust.network/'

export const api = new ApiPromise({
  provider: new WsProvider(chainWsUrl),
  typesBundle: typesBundleForPolkadot
})
